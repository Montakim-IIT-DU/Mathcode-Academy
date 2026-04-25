import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProblemListPage from "../pages/ProblemListPage";
import ProblemDetailsPage from "../pages/ProblemDetailsPage";
import ContestListPage from "../pages/ContestListPage";
import ContestDetailsPage from "../pages/ContestDetailsPage";
import ContestStandingsPage from "../pages/ContestStandingsPage";
import LeaderboardPage from "../pages/LeaderboardPage";
import MySubmissionsPage from "../pages/MySubmissionsPage";
import UserProfilePage from "../pages/UserProfilePage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import ManageProblemsPage from "../pages/ManageProblemsPage";
import ManageContestsPage from "../pages/ManageContestsPage";
import NotFoundPage from "../pages/NotFoundPage";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/problems" element={<ProblemListPage />} />
        <Route path="/problems/:id" element={<ProblemDetailsPage />} />
        <Route path="/contests" element={<ContestListPage />} />
        <Route path="/contests/:id" element={<ContestDetailsPage />} />
        <Route path="/contests/:id/standings" element={<ContestStandingsPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/submissions" element={<MySubmissionsPage />} />
        <Route path="/profile/:userId" element={<UserProfilePage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/problems" element={<ManageProblemsPage />} />
        <Route path="/admin/contests" element={<ManageContestsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;