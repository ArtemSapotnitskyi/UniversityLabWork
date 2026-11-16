import { Route, Routes } from "react-router";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";
import CarsPage from "./pages/CarsPage";
import CarDetailsPage from "./pages/CarDetailsPage";
import CreateCarPage from "./pages/CreateCarPage";
import EditCarPage from "./pages/EditCarPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ConfirmEmailPage from "./pages/ConfirmEmailPage";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="/confirm-email" element={<ConfirmEmailPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="cars">
            <Route index element={<CarsPage />} />
            <Route path=":id" element={<CarDetailsPage />} />

            <Route path=":id/edit" element={<EditCarPage />} />

            <Route element={<ProtectedRoute requireAdmin={true} />}>
              <Route path="new" element={<CreateCarPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
