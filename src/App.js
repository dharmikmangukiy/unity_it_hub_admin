import React, { useState, useRef, useEffect } from "react";
import {
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Login from "./login/Login";
import Sidebar from "./sidebar/Sidebar.jsx";
import Header from "./sidebar/Header.jsx";
import Dashboard from "./dashboard/Dashboard.jsx";
import Deposit from "./deposit/Deposit.jsx";
import Withdraw from "./withdraw/Withdraw.jsx";
import DepositHistory from "./deposit_history/DepositHistory";
import WithdrawHistory from "./withdraw_history/WithdrawHistory";
// import Employees from "./employees/Employees";
import RoleManagement from "./role_management/RoleManagement";
import ClientList from "./client_list/ClientList";
import ListRequest from "./list_request/ListRequest";
import PendingKYC from "./pending_kyc/PendingKYC";
import HistoryKYC from "./history_kyc/HistoryKYC";
import CommisionGroup from "./commision_group/CommisionGroup";
// import GenerateIncome from './generate_income/GenerateIncome';
import Mt5Group from "./mt5_group/Mt5Group";
import Setting from "./setting/Setting";
import PopupImage from "./popup_image/PopupImage";
import CurrencyRate from "./currency_rate/CurrencyRate";
import Ticket from "./ticket/Ticket";
import Notification from "./notification/Notification";
import ActivityLog from "./activity_log/ActivityLog";
import FAQEditor from "./faq_editor/FAQEditor";
import IBWithdraw from "./ib_withdraw/IBWithdraw";
import PartnershipWithdraw from "./partnership_withdraw/PartnershipWithdraw";
import Master from "./master/Master";
import Profile from "./profile/Profile";
import Myaccount from "./my_account/Myaccount";
import CreateRole from "./role_management/CreateRole";
import Leads from "./leads/Leads";
import Remainder from "./remainder/Remainder";
import Plans from "./plans/Plans";
import ViewTicket from "./ticket/ViewTicket";
import MT5Bonus from "./report/MT5Bonus";
import IBCommisions from "./admin_accounts/ib_commisions/IBCommisions";
import TradeStatistics from "./admin_accounts/trade_statistics/TradeStatistics";
import PositionReport from "./report/PositionReport";
import TradeHistory from "./report/TradeHistory";
import CopyOpenTrades from "./report/CopyOpenTrades";
import TradeHistoryTotal from "./report/TradeHistoryTotal";
import IBCommisionReport from "./report/IBCommisionReport";
import UserProfitAndLoss from "./report/UserProfitAndLoss";
import SalesIncentive from "./report/SalesIncentive";

import BasicReport from "./report/BasicReport";
import BasicIbReport from "./report/BasicIbReport";
import IBStructure from "./commision_group/ib_structure";
import Link from "./marketing/Link";
import Target from "./marketing/Target";
import MenuSetting from "./setting/MenuSetting";
import PammDashboard from "./pamm/PammDashboard";
import PammActivityLog from "./pamm/PammActivityLog";
import MmManagement from "./pamm/MmManagement";
import InvestorRequest from "./pamm/InvestorRequest";
import PammUser from "./pamm/PammUser";
import SalesReport from "./report/SalesReport";
import Employees from "./Staff/Employees";
import MenuItems from "./setting/MenuItems";
import UsersGroups from "./users_group/userGroup";
import PammPortfolioProfile from "./pamm/PammPortfolioProfile";
import MoneyManagerProfile from "./pamm/MoneyManagerProfile";
import MT5BonusRequests from "./MT5BonusManage/MT5BonusRequests";
import Mt5BonusOffer from "./MT5BonusManage/Mt5BonusOffer";
import RefreshData from "./refresha/RefreshData";
import { IsApprove, Url } from "./global";
import axios from "axios";
import Oldclient from "./client_list/Oldclient";
import TeamCompare from "./report/TeamCompare";
import TotalDepositsReport from "./TransactionReports/TotalDepositsReport";
import TotalWithdrawalReport from "./TransactionReports/TotalWithdrawalReport";
import TotalCreditInReport from "./TransactionReports/TotalCreditInReport";
import TotalCreditOutReport from "./TransactionReports/TotalCreditOutReport";
import UnfundedAccounts from "./TransactionReports/UnfundedAccounts";
import ClientPassword from "./TransactionReports/ClientPassword";
import LeasConverted from "./TransactionReports/LeasConverted";
import LeadCallStatus from "./TransactionReports/LeadCallStatus";
import Referrals from "./profile/Referrals";
import RebateCommissionSummary from "./TransactionReports/RebateCommissionSummary";
import io from "socket.io-client";
import Watchlist from "./Watchlist";
import CopyUser from "./copy_treding/CopyUser";
import CopyMasterUses from "./copy_treding/CopyMasterUses";
import Internaltranfer from "./deposit/Internaltranfer";
import AffiliateList from "./affiliate/AffiliateList";
import TradeAndWin from "./tradeandwin/TradeAndWin";
import SpinList from "./spin/SpinList";
import FantasticFourList from "./Fantastic Four/FantasticFourList";
import AdditionalDocument from "./additional_doc/AdditionalDocument";
import LeverageChange from "./leverageChange/LeverageChange";
import BonusList from "./BonusList/BonusList";
import TradeWinMaster from "./TradeWinMaster/TradeWinMaster";
import FantasticFourTours from "./FantasticFourTours/FantasticFourTours";
import ScriptMasterList from "./ScriptMaster/ScriptMasterList";
import GroupSpread from "./group_spread/GroupSpread";
import OTPRequests from "./OTPRequests/OTPRequests";
import BankList from "./bank_list/BankList";
import Leaddashboard from "./leads/Leaddashboard";
import Lead_by_task_summary from "./leads/Lead_by_task_summary";
import Lead_sales_person_target from "./leads/Lead_sales_person_target";
import Lead_sales_team_target from "./leads/Lead_sales_team_target";
import Lead_sales_person_activity from "./leads/Lead_sales_person_activity";
import Lead_by_country from "./leads/Lead_by_country";
import Lead_by_sources from "./leads/Lead_by_sources";
import Lead_team_wise_report from "./leads/Lead_team_wise_report";
import HolidayList from "./HolidayList/HolidayList";
import Reminders from "./leads/Reminders";
import Mt5_wise_user_rebate_report from "./report/Mt5_wise_user_rebate_report";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Mt5_wise_ib_master_ib_list from "./report/Mt5_wise_ib_master_ib_list";
import Ib_rebate_report from "./report/Ib_rebate_report";
var redirect_url = "";
function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}
// const Permission = async () => {

// };
// var client = "";
var websocketurl1 = "https://nexaexch.net:2053/";
var client = io(websocketurl1);
const App = () => {
  useScrollToTop();
  const ref = useRef();
  const navigate = useNavigate();
  const [login, setLogin] = useState(localStorage.getItem("login"));
  const [sidebar, setSidebar] = useState(false);
  const [firstCall, setFirstCall] = useState(true);
  const [permission, setPermission] = useState({});
  const [loader, setLoader] = useState(true);
  toast.configure();
  const permissionfuc = async (prop) => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
    }
    param.append("action", "get_admin_permissions");
    axios
      .post(Url + "/ajaxfiles/update_user_profile.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          setLogin("true");

          setLoader(false);
          return;
        }
        if (res.data.status == "ok") {
          localStorage.setItem("login", false);
          setLoader(false);
          setLogin(false);
          redirect_url = res.data.redirect;
          // setFirstCall(false);
          setPermission(res.data.admin_button_permissions);
          if (prop) {
            navigate(prop);
          }
          if (res?.data?.admin_button_permissions) {
            if (res?.data?.admin_button_permissions?.play_alert_sound) {
              client.on("connect", function (data) {});
              client.on("playSound1", function () {
                var audio = document.getElementById("audioD");
                audio.play();
              });
              client.on("playSoundW", function () {
                var audio = document.getElementById("audioWITHDREW");
                audio.play();
              });
              client.on("playSoundI", function () {
                var audio = document.getElementById("audioINETENAL");
                audio.play();
              });
              client.on("playSoundIB", function () {
                var audio = document.getElementById("audioIB");
                audio.play();
              });
              client.on("playSoundKyc", function () {
                var audio = document.getElementById("audioKyc");
                audio.play();
              });
            }
          }
        }
      });
  };
  useEffect(() => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
    }
    axios
      .post(`${Url}/ajaxfiles/login_session_check.php`, param)
      .then((res) => {
        if (res.data.status !== "ok") {
          localStorage.setItem("login", true);
          setLogin("true");
        } else {
          localStorage.setItem("login", false);
          setLogin("false");

          permissionfuc();
        }
      });
  }, []);
  if (login == "true") {
    client?.disconnect();

    return (
      <div class="loginbg">
        <Login setLogin={setLogin} permissionfuc={permissionfuc} />
      </div>
    );
  } else {
    // permissionfuc();
    return (
      <div>
        {loader == true ? (
          <div className="loader">
            <div className="clock">
              <div className="pointers"></div>
            </div>
          </div>
        ) : (
          <div
            className={
              sidebar
                ? "app-wrapper app-sidebar-mobile-open app-sidebar-fixed app-header-fixed"
                : "app-wrapper app-sidebar-fixed app-header-fixed"
            }
          >
            <Sidebar
              cside={sidebar}
              setSidebar={setSidebar}
              setLogin={setLogin}
            />
            <div className="app-main">
              <Header setSidebar={setSidebar} setLogin={setLogin} />
              <div className="app-content">
                <Routes>
                  {/* <Route
                    exact
                    path="/"
                    element={
                      <Dashboard setLogin={setLogin} permission={permission} />
                    }
                  /> */}
                  <Route
                    path="*"
                    element={
                      <Navigate
                        to={redirect_url}
                        replace
                        setLogin={setLogin}
                        permission={permission}
                      />
                    }
                  />
                  <Route
                    exact
                    path="/dashboard"
                    element={
                      <Dashboard setLogin={setLogin} permission={permission} />
                    }
                  />
                  <Route
                    exact
                    path="/employees"
                    element={<Employees permission={permission} />}
                  />
                  <Route
                    exact
                    path="/role_management"
                    element={<RoleManagement permission={permission} />}
                  />
                  <Route
                    exact
                    path="/client_list"
                    element={<ClientList permission={permission} />}
                  />
                  {/* <Route exact path="/client_list" element={<Oldclient />} /> */}
                  <Route
                    exact
                    path="/client_list/:id"
                    element={<ClientList permission={permission} />}
                  />
                  <Route exact path="/list_request" element={<ListRequest />} />
                  <Route
                    exact
                    path="/pending_kyc"
                    element={<PendingKYC permission={permission} />}
                  />{" "}
                  <Route
                    exact
                    path="/additional_documents"
                    element={<AdditionalDocument permission={permission} />}
                  />
                  <Route
                    exact
                    path="/affiliate"
                    element={<AffiliateList permission={permission} />}
                  />
                  <Route
                    exact
                    path="/trade_and_win"
                    element={<TradeAndWin permission={permission} />}
                  />
                  <Route
                    exact
                    path="/spin_list"
                    element={<SpinList permission={permission} />}
                  />
                  <Route
                    exact
                    path="/fantastic_four_list"
                    element={<FantasticFourList permission={permission} />}
                  />
                  <Route
                    exact
                    path="/pending_kyc/:id"
                    element={<PendingKYC permission={permission} />}
                  />
                  <Route
                    exact
                    path="/history_kyc"
                    element={<HistoryKYC permission={permission} />}
                  />
                  <Route
                    exact
                    path="/history_kyc/:id"
                    element={<HistoryKYC permission={permission} />}
                  />
                  <Route
                    exact
                    path="/commision_group"
                    element={<CommisionGroup permission={permission} />}
                  />
                  {/* <Route exact path="/generate_income" element={<GenerateIncome />} /> */}
                  <Route exact path="/mt5_group" element={<Mt5Group />} />
                  <Route
                    exact
                    path="/setting"
                    element={<Setting permission={permission} />}
                  />
                  <Route exact path="/watchlist" element={<Watchlist />} />
                  <Route
                    exact
                    path="/popup_image"
                    element={<PopupImage permission={permission} />}
                  />
                  <Route
                    exact
                    path="/currency_rate"
                    element={<CurrencyRate permission={permission} />}
                  />
                  <Route
                    exact
                    path="/ticket"
                    element={<Ticket permission={permission} />}
                  />
                  <Route
                    exact
                    path="/notification"
                    element={<Notification />}
                  />
                  <Route exact path="/activity_log" element={<ActivityLog />} />
                  <Route
                    exact
                    path="/faq_editor"
                    element={<FAQEditor permission={permission} />}
                  />
                  <Route
                    exact
                    path="/ib_withdraw"
                    element={<IBWithdraw permission={permission} />}
                  />
                  <Route exact path="/sales_report" element={<SalesReport />} />
                  <Route exact path="/team_compare" element={<TeamCompare />} />
                  <Route
                    exact
                    path="/total_deposit_report"
                    element={<TotalDepositsReport />}
                  />
                  <Route
                    exact
                    path="/total_withdraw_report"
                    element={<TotalWithdrawalReport />}
                  />
                  <Route
                    exact
                    path="/total_credit_in_report"
                    element={<TotalCreditInReport />}
                  />
                  <Route
                    exact
                    path="/total_credit_out_report"
                    element={<TotalCreditOutReport />}
                  />
                  <Route exact path="/refresh_data" element={<RefreshData />} />
                  <Route
                    exact
                    path="/ib_withdraw"
                    element={<PartnershipWithdraw />}
                  />
                  <Route
                    exact
                    path="/deposit"
                    element={<Deposit permission={permission} />}
                  />
                  <Route
                    exact
                    path="/bank_list"
                    element={<BankList permission={permission} />}
                  />
                  <Route
                    exact
                    path="/internal_transfer"
                    element={<Internaltranfer permission={permission} />}
                  />
                  <Route
                    exact
                    path="/withdrawal"
                    element={<Withdraw permission={permission} />}
                  />
                  <Route
                    exact
                    path="/leaddashboard"
                    element={<Leaddashboard permission={permission} />}
                  />
                  <Route exact path="/master/:id" element={<Master />} />
                  <Route
                    exact
                    path="/profile/:id"
                    element={<Profile socket={client} />}
                  />
                  {/* <Route exact path="/deposit_history" element={<DepositHistory />} /> */}
                  <Route
                    exact
                    path="/withdraw_history"
                    element={<WithdrawHistory />}
                  />
                  <Route exact path="/myAccount" element={<Myaccount />} />
                  <Route
                    exact
                    path="/createRole/:id"
                    element={<CreateRole />}
                  />
                  <Route exact path="/createRole" element={<CreateRole />} />
                  <Route
                    exact
                    path="/leads_list"
                    element={<Leads permission={permission} />}
                  />
                  <Route
                    exact
                    path="/leads_list/:id"
                    element={<Leads permission={permission} />}
                  />
                  <Route
                    exact
                    path="/leads_list/:id/:id1"
                    element={<Leads permission={permission} />}
                  />
                  <Route
                    exact
                    path="/Lead_team_wise_report"
                    element={<Lead_team_wise_report permission={permission} />}
                  />
                  <Route
                    exact
                    path="/Reminders"
                    element={<Reminders permission={permission} />}
                  />
                  <Route
                    exact
                    path="/Lead_by_country"
                    element={<Lead_by_country permission={permission} />}
                  />
                  <Route
                    exact
                    path="/Lead_by_sources"
                    element={<Lead_by_sources permission={permission} />}
                  />
                  <Route
                    exact
                    path="/Lead_by_task_summary"
                    element={<Lead_by_task_summary permission={permission} />}
                  />
                  <Route
                    exact
                    path="/Lead_sales_person_target"
                    element={
                      <Lead_sales_person_target permission={permission} />
                    }
                  />
                  <Route
                    exact
                    path="/Lead_sales_team_target"
                    element={<Lead_sales_team_target permission={permission} />}
                  />
                  <Route
                    exact
                    path="/Lead_sales_person_activity"
                    element={
                      <Lead_sales_person_activity permission={permission} />
                    }
                  />
                  <Route exact path="/reminder" element={<Remainder />} />
                  <Route
                    exact
                    path="/ib_commisions"
                    element={<IBCommisions />}
                  />
                  <Route exact path="/Comingsoon" element={<Dashboard />} />
                  <Route exact path="/plans" element={<Plans />} />
                  <Route
                    exact
                    path="/view_ticket/:id"
                    element={<ViewTicket permission={permission} />}
                  />
                  <Route
                    exact
                    path="/deposit_report"
                    element={<DepositHistory />}
                  />
                  <Route
                    exact
                    path="/mt5_wise_user_rebate_report"
                    element={<Mt5_wise_user_rebate_report />}
                  />
                  <Route
                    exact
                    path="/withdraw_report"
                    element={<WithdrawHistory />}
                  />
                  {/* <Route exact path="/referrals" element={<Referrals />} /> */}
                  <Route
                    exact
                    path="/rebate_and_commission_summary"
                    element={<RebateCommissionSummary />}
                  />
                  <Route
                    exact
                    path="/trade_statistics"
                    element={<TradeStatistics />}
                  />
                  <Route
                    exact
                    path="/lead_call_status"
                    element={<LeadCallStatus />}
                  />
                  <Route
                    exact
                    path="/get_otp_requests_register"
                    element={<OTPRequests />}
                  />
                  <Route exact path="/mt5_bonus" element={<MT5Bonus />} />
                  <Route exact path="/position" element={<PositionReport />} />
                  <Route
                    exact
                    path="/trade_history"
                    element={<TradeHistory />}
                  />
                  <Route
                    exact
                    path="/trade_history_total"
                    element={<TradeHistoryTotal />}
                  />
                  <Route
                    exact
                    path="/copy_open_trades"
                    element={<CopyOpenTrades />}
                  />
                  <Route exact path="/basic_report" element={<BasicReport />} />
                  <Route exact path="/mt5_wise_ib_master_ib_list" element={<Mt5_wise_ib_master_ib_list />} />
                  <Route exact path="/ib_rebate_report" element={<Ib_rebate_report />} />

                  <Route
                    exact
                    path="/user_profit_and_loss"
                    element={<UserProfitAndLoss />}
                  />
                  <Route
                    exact
                    path="/ib_commision_report"
                    element={<IBCommisionReport />}
                  />
                  <Route
                    exact
                    path="/basic_ib_report"
                    element={<BasicIbReport />}
                  />
                  <Route exact path="/HolidayList" element={<HolidayList />} />
                  <Route
                    exact
                    path="/unfunded_accounts"
                    element={<UnfundedAccounts />}
                  />
                  <Route
                    exact
                    path="/client_password"
                    element={<ClientPassword />}
                  />
                  <Route
                    exact
                    path="/lead_converted"
                    element={<LeasConverted />}
                  />
                  <Route exact path="/ib_structure" element={<IBStructure />} />
                  <Route
                    exact
                    path="/link"
                    element={<Link permission={permission} />}
                  />
                  <Route
                    exact
                    path="/Salesman"
                    element={<Target permission={permission} />}
                  />
                  <Route
                    exact
                    path="/LeverageChange"
                    element={<LeverageChange permission={permission} />}
                  />
                  <Route
                    exact
                    path="/TradeWinMaster"
                    element={<TradeWinMaster permission={permission} />}
                  />
                  <Route
                    exact
                    path="/script_master_list"
                    element={<ScriptMasterList permission={permission} />}
                  />
                  <Route
                    exact
                    path="/FantasticFourTours"
                    element={<FantasticFourTours permission={permission} />}
                  />
                  <Route
                    exact
                    path="/group_spread"
                    element={<GroupSpread permission={permission} />}
                  />
                  <Route
                    exact
                    path="/BonusList"
                    element={<BonusList permission={permission} />}
                  />
                  <Route
                    exact
                    path="/change_menu_order"
                    element={<MenuSetting />}
                  />
                  <Route
                    exact
                    path="/menu_item"
                    element={<MenuItems permission={permission} />}
                  />
                  <Route
                    exact
                    path="/pamm_dashboard"
                    element={<PammDashboard />}
                  />
                  <Route
                    exact
                    path="/pamm_activity_log"
                    element={<PammActivityLog />}
                  />
                  <Route
                    exact
                    path="/pamm_mm_management"
                    element={<MmManagement permission={permission} />}
                  />
                  <Route
                    exact
                    path="/copy_master_management"
                    element={<CopyMasterUses permission={permission} />}
                  />
                  <Route
                    exact
                    path="/pamm_investor_request"
                    element={<InvestorRequest />}
                  />
                  <Route
                    exact
                    path="/pamm_user_management"
                    element={<PammUser permission={permission} />}
                  />
                  <Route
                    exact
                    path="/copy_user_management"
                    element={<CopyUser permission={permission} />}
                  />
                  <Route
                    exact
                    path="/sales_incentive"
                    element={<SalesIncentive />}
                  />
                  <Route
                    exact
                    path="/user_groups"
                    element={<UsersGroups permission={permission} />}
                  />
                  <Route
                    path="/portfolio_profile/:id/:portfolioUserId"
                    element={<PammPortfolioProfile />}
                  />
                  <Route
                    path="/money_manager_profile/:id/:moneyManagerUserId"
                    element={<MoneyManagerProfile />}
                  />
                  <Route
                    path="/mt5_bonus_request"
                    element={<MT5BonusRequests permission={permission} />}
                  />
                  <Route
                    path="/mt5_bonus_offer"
                    element={<Mt5BonusOffer permission={permission} />}
                  />
                </Routes>

                {/* <Footer /> */}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
};

export { App };
