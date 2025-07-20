import { Routes, Route } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import PageLoading from "../components/loading/page";
import Layout from "../components/layout";
import AuthRoute from "./auth_route";

const Dashboard = lazy(() => import("../pages/dashboard"));
const UserPage = lazy(() => import("../pages/user"));
const RolePage = lazy(() => import("../pages/role"));
const LinkPage = lazy(() => import("../pages/link"));
const LogPage = lazy(() => import("../pages/log"));
const ProfilePage = lazy(() => import("../pages/profile"));

const LoginPage = lazy(() => import("../pages/login"));
const ErrorPage = lazy(() => import("../pages/error"));

export default function Router() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/">
            <Route index={true} element={
              <AuthRoute>
                <Dashboard />
              </AuthRoute>
            } />
          </Route>

          <Route path="/logs">
            <Route index={true} element={
              <AuthRoute>
                <LogPage />
              </AuthRoute>
            } />
          </Route>

          <Route path="/links">
            <Route index={true} element={
              <AuthRoute>
                <LinkPage />
              </AuthRoute>
            } />
          </Route>

          <Route path="/links">
            <Route index={true} element={
              <AuthRoute>
                <LinkPage />
              </AuthRoute>
            } />
          </Route>

          <Route path="/users">
            <Route index={true} element={
              <AuthRoute>
                <UserPage />
              </AuthRoute>
            } />
          </Route>

          <Route path="/profile">
            <Route index={true} element={
              <AuthRoute>
                <ProfilePage />
              </AuthRoute>
            } />
          </Route>

          <Route path="/roles">
            <Route index={true} element={
              <AuthRoute>
                <RolePage />
              </AuthRoute>
            } />
          </Route>
        </Route>

        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Suspense>
  );
}