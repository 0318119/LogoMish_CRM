import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from '../pages/Dashboard'
// CSS ==========================
import '../assets/css/main.css'
// BOOTSTRAP ====================
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import AllOrders from '../pages/AllOrders';
import CustomersList from '../pages/CustomersList';
import DisputeOrder from '../pages/DisputeOrder';
import UsersList from '../pages/UsersList';
import Login from '../pages/Login';
import Register from '../pages/Register'
import UserStatistics from '../pages/UserStatistics';
import CustomerLeads from '../pages/CustomerLeads';
import Chat from '../pages/Chat';
import Profile from '../pages/Profile';
import ForgotPasswordSteps from '../pages/ForgotPasswordSteps';
import ClientLogin from '../ClientSidePages/ClientLogin';
import ClientRegister from '../ClientSidePages/ClientRegister';
import ClientDashboard from '../ClientSidePages/ClientDashboard';
import ClientAllOrders from '../ClientSidePages/ClientAllOrders';
import ClientChat from '../ClientSidePages/ClientChat';
import ClientDisputeOrder from '../ClientSidePages/ClientDisputeOrder';
import ClientProfile from '../ClientSidePages/ClientProfile';
import AskLogin from '../pages/AskLogin';
import ContactUs from '../ClientSidePages/ContactUs';
import AllProfiles from '../pages/AllProfiles';
import ClientForgotPasswordSteps from '../ClientSidePages/ClientForgotPasswordSteps';
import OrderReply from '../pages/OrderReply';
import OrderQuotations from '../pages/OrderQuotations';
import ClientOrderQuotations from '../ClientSidePages/ClientOrderQuotations';
import ClientOrderReply from '../ClientSidePages/ClientOrderReply';
import ClientChangePwd from '../ClientSidePages/ClientChangePwd';
import ChangePwd from '../pages/ChangePwd';
import ClientPayment from '../ClientSidePages/ClientPayment';
import ClientFiles from '../ClientSidePages/ClientFiles';
import FrontSales from '../pages/FrontSales';
import UpSales from '../pages/UpSales';
import secureLocalStorage from "react-secure-storage";
import Error from '../pages/Error';
import ClientRefer from '../ClientSidePages/ClientRefer';
import Refer from '../pages/Refer';
import LeadsGeneration from '../pages/LeadsGeneration';
import OrderLeads from '../pages/OrderLeads';
import ViewFrontSaleOrderComp from '../components/ViewfrontsaleordersComp';
import ViewFrontSaleOrder from '../pages/Viewfrontsaleorder';
import ViewUpsaleorder from '../pages/ViewUpsaleorder';
import ViewOrdersQuotation from '../pages/ViewOrdersQuotation';
import OtherPlatFormsOrderSaveOrders from '../pages/OtherPlatFormsOrderSaveOrders';
import ViewAllNotifications from '../pages/ViewAllNotifications';
// import LoginLeadsGeneration from '../LeadsGenerationPages/LoginLeadsGeneration';
// import LeadsGenerationDashboard from '../LeadsGenerationPages/LeadsGenerationDashboard';
// import AllLeads from '../LeadsGenerationPages/AllLeads'

function routing() {
  return (
    <>
      <Router>
        <Routes>


          {
            secureLocalStorage.getItem("access_token") !== undefined && secureLocalStorage.getItem("access_token") !== null && secureLocalStorage.getItem("access_token") !== "" ?
              <>
                {
                  secureLocalStorage.getItem("type") == 'user' ?
                    <>
                      {
                        // super admin
                        secureLocalStorage.getItem("role_id") == 1 ?
                          <>
                            <Route path="/Dashboard" element={<Dashboard />} />
                            <Route path="CustomersList" element={<CustomersList />} />
                            <Route path="DisputeOrder" element={<DisputeOrder />} />
                            <Route path="UsersList" element={<UsersList />} />
                            <Route path='AllOrders' element={<AllOrders />} />
                            <Route path='UserStatistics' element={<UserStatistics />} />
                            <Route path='CustomerLeads' element={<CustomerLeads />} />
                            <Route path='Chat' element={<Chat />} />
                            <Route path='Profile' element={<Profile />} />
                            <Route path="/OrderQuotations" element={<OrderQuotations />} />
                            <Route path="/OrderReply" element={<OrderReply />} />
                            <Route path="/ChangePwd" element={<ChangePwd />} />
                            <Route path="/FrontSales" element={<FrontSales />} />
                            <Route path="/UpSales" element={<UpSales />} />
                            <Route path="/AllProfiles" element={<AllProfiles />} />
                            <Route path="/ViewFrontSaleOrder" element={<ViewFrontSaleOrder />} />
                            <Route path="/ViewUpsaleorder" element={<ViewUpsaleorder />} />
                            <Route path="/ViewOrderRequest" element={<ViewOrdersQuotation />} />
                            <Route path="/OtherPlatFormsOrderSaveOrders" element={<OtherPlatFormsOrderSaveOrders />} />
                            <Route path="/Refer" element={<Refer />} />
                            <Route path='/ViewAllNotifications' element={<ViewAllNotifications />} />
                          </>
                          // project manager
                          : secureLocalStorage.getItem("role_id") == 2 ?
                            <>
                              <Route path="/Dashboard" element={<Dashboard />} />
                              <Route path="CustomersList" element={<CustomersList />} />
                              <Route path="DisputeOrder" element={<DisputeOrder />} />
                              <Route path="UsersList" element={<UsersList />} />
                              <Route path='AllOrders' element={<AllOrders />} />
                              <Route path='UserStatistics' element={<UserStatistics />} />
                              <Route path='CustomerLeads' element={<CustomerLeads />} />
                              <Route path='Chat' element={<Chat />} />
                              <Route path='Profile' element={<Profile />} />
                              <Route path="/OrderQuotations" element={<OrderQuotations />} />
                              <Route path="/OrderReply" element={<OrderReply />} />
                              <Route path="/ChangePwd" element={<ChangePwd />} />
                              <Route path="/FrontSales" element={<FrontSales />} />
                              <Route path="/UpSales" element={<UpSales />} />
                              <Route path="/Refer" element={<Refer />} />
                              <Route path="/ViewFrontSaleOrder" element={<ViewFrontSaleOrder />} />
                              <Route path="/ViewUpsaleorder" element={<ViewUpsaleorder />} />
                              <Route path="/ViewOrderRequest" element={<ViewOrdersQuotation />} />
                              <Route path="/OtherPlatFormsOrderSaveOrders" element={<OtherPlatFormsOrderSaveOrders />} />
                              <Route path='/ViewAllNotifications' element={<ViewAllNotifications />} />
                            </>
                            // team lead
                            : secureLocalStorage.getItem("role_id") == 3 ?
                              <>
                                <Route path="/Dashboard" element={<Dashboard />} />
                                <Route path="CustomersList" element={<CustomersList />} />
                                <Route path="DisputeOrder" element={<DisputeOrder />} />
                                <Route path="UsersList" element={<UsersList />} />
                                <Route path='AllOrders' element={<AllOrders />} />
                                <Route path='UserStatistics' element={<UserStatistics />} />
                                <Route path='CustomerLeads' element={<CustomerLeads />} />
                                <Route path='Chat' element={<Chat />} />
                                <Route path='Profile' element={<Profile />} />
                                <Route path="/OrderQuotations" element={<OrderQuotations />} />
                                <Route path="/OrderReply" element={<OrderReply />} />
                                <Route path="/ChangePwd" element={<ChangePwd />} />
                                <Route path="/FrontSales" element={<FrontSales />} />
                                <Route path="/UpSales" element={<UpSales />} />
                                <Route path="/Refer" element={<Refer />} />
                                <Route path="/ViewFrontSaleOrder" element={<ViewFrontSaleOrder />} />
                                <Route path="/ViewUpsaleorder" element={<ViewUpsaleorder />} />
                                <Route path="/ViewOrderRequest" element={<ViewOrdersQuotation />} />
                                <Route path="/OtherPlatFormsOrderSaveOrders" element={<OtherPlatFormsOrderSaveOrders />} />
                                <Route path='/ViewAllNotifications' element={<ViewAllNotifications />} />
                              </>
                              // closer
                              : secureLocalStorage.getItem("role_id") == 4 ?
                                <>
                                  <Route path="/Dashboard" element={<Dashboard />} />
                                  <Route path="CustomersList" element={<CustomersList />} />
                                  <Route path="DisputeOrder" element={<DisputeOrder />} />
                                  <Route path="UsersList" element={<UsersList />} />
                                  <Route path='AllOrders' element={<AllOrders />} />
                                  <Route path='UserStatistics' element={<UserStatistics />} />
                                  <Route path='CustomerLeads' element={<CustomerLeads />} />
                                  <Route path='Chat' element={<Chat />} />
                                  <Route path='Profile' element={<Profile />} />
                                  <Route path="/OrderQuotations" element={<OrderQuotations />} />
                                  <Route path="/OrderReply" element={<OrderReply />} />
                                  <Route path="/ChangePwd" element={<ChangePwd />} />
                                  <Route path="/FrontSales" element={<FrontSales />} />
                                  <Route path="/UpSales" element={<UpSales />} />
                                  <Route path="/Refer" element={<Refer />} />
                                  <Route path='/ViewAllNotifications' element={<ViewAllNotifications />} />
                                </>
                                // back office
                                : secureLocalStorage.getItem("role_id") == 5 ?
                                  <>
                                    <Route path="/Dashboard" element={<Dashboard />} />
                                    <Route path="CustomersList" element={<CustomersList />} />
                                    <Route path="DisputeOrder" element={<DisputeOrder />} />
                                    <Route path="UsersList" element={<UsersList />} />
                                    <Route path='AllOrders' element={<AllOrders />} />
                                    <Route path='UserStatistics' element={<UserStatistics />} />
                                    <Route path='CustomerLeads' element={<CustomerLeads />} />
                                    <Route path='Chat' element={<Chat />} />
                                    <Route path='Profile' element={<Profile />} />
                                    <Route path="/OrderQuotations" element={<OrderQuotations />} />
                                    <Route path="/OrderReply" element={<OrderReply />} />
                                    <Route path="/ChangePwd" element={<ChangePwd />} />
                                    <Route path="/FrontSales" element={<FrontSales />} />
                                    <Route path="/UpSales" element={<UpSales />} />
                                    <Route path="/Refer" element={<Refer />} />
                                    <Route path='/ViewAllNotifications' element={<ViewAllNotifications />} />
                                  </>
                                  // fresher
                                  : secureLocalStorage.getItem("role_id") == 6 ?
                                    <>
                                      <Route path="/CustomersList" element={<CustomersList />} />
                                      <Route path='/ViewAllNotifications' element={<ViewAllNotifications />} />
                                      <Route path="UsersList" element={<UsersList />} />
                                      <Route path='CustomerLeads' element={<CustomerLeads />} />
                                      <Route path='Chat' element={<Chat />} />
                                      <Route path='Profile' element={<Profile />} />
                                      <Route path="/OrderQuotations" element={<OrderQuotations />} />
                                      <Route path="/ChangePwd" element={<ChangePwd />} />
                                    </>
                                    // LEAD GENERATION ROLE
                                    : secureLocalStorage.getItem("role_id") == 7 ?
                                      <>
                                        <Route path="/Dashboard" element={<Dashboard />} />
                                        <Route path="/LeadsGeneration" element={<LeadsGeneration />} />
                                        <Route path="/OrderLeads" element={<OrderLeads />} />
                                        <Route path='/ViewAllNotifications' element={<ViewAllNotifications />} />
                                      </>
                                      : <Route path="*" element={<Error />} />

                      }

                    </>
                    :
                    <Route path="*" element={<Error />} />
                }
                {
                  secureLocalStorage.getItem("type") == 'client' ?
                    <>
                      <Route path="/ClientDashboard" element={<ClientDashboard />} />
                      <Route path="/ClientAllOrders" element={<ClientAllOrders />} />
                      <Route path="/ClientRefer" element={<ClientRefer />} />
                      <Route path="/ClientChat" element={<ClientChat />} />
                      <Route path="/ClientDisputeOrder" element={<ClientDisputeOrder />} />
                      <Route path="/ClientProfile" element={<ClientProfile />} />
                      <Route path="/ContactUs" element={<ContactUs />} />
                      <Route path="/ClientOrderQuotations" element={<ClientOrderQuotations />} />
                      <Route path="/ClientOrderReply" element={<ClientOrderReply />} />
                      <Route path="/ClientChangePwd" element={<ClientChangePwd />} />
                      <Route path="/ClientFiles" element={<ClientFiles />} />
                    </>
                    :
                    <Route path="*" element={<Error />} />
                }

                {/* =========== CLIENT SIDE ROUTING ================== */}
              </>
              :
              <Route path="*" element={<Error />} />
          }
          {
            secureLocalStorage.getItem("access_token") == undefined || secureLocalStorage.getItem("access_token") == null || secureLocalStorage.getItem("access_token") == "" || secureLocalStorage.getItem("access_token") == secureLocalStorage.getItem("access_token") ?
              <>
                <Route path='/' element={<AskLogin />} />
                <Route path='/Login' element={<Login />} />
                <Route path='/Register' element={<Register />} />
                <Route path='ForgotPasswordSteps' element={<ForgotPasswordSteps />} />
                {/* ==================== */}
                <Route path='/ClientLogin' element={<ClientLogin />} />
                <Route path="/ClientRegister" element={<ClientRegister />} />
                <Route path="/ClientForgotPasswordSteps" element={<ClientForgotPasswordSteps />} />
              </>
              :
              <Route path="*" element={<Error />} />
          }
          <Route path="/ClientPayment" element={<ClientPayment />} />
        </Routes>
      </Router>
    </>
  )
}

export default routing