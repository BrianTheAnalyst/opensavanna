
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

// Import pages
import IndexPage from "@/pages/Index";
import AboutPage from "@/pages/About";
import DatasetsPage from "@/pages/Datasets";
import DatasetDetailPage from "@/pages/dataset-detail";
import DatasetEditPage from "@/pages/dataset-edit";
import UploadPage from "@/pages/Upload";
import NotFoundPage from "@/pages/NotFound";
import ApiPage from "@/pages/Api";
import AuthPage from "@/pages/Auth";
import InsightsPage from "@/pages/Insights";
import DatasetVerificationPage from "@/pages/admin/DatasetVerification";
import EntityDetail from "@/pages/entity-detail/EntityDetail";
import EntitiesExplorer from "@/pages/entities/EntitiesExplorer";

// Create router
const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/datasets",
    element: <DatasetsPage />,
  },
  {
    path: "/datasets/:id",
    element: <DatasetDetailPage />,
  },
  {
    path: "/dataset-edit/:id",
    element: <DatasetEditPage />,
  },
  {
    path: "/upload",
    element: <UploadPage />,
  },
  {
    path: "/api",
    element: <ApiPage />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/insights",
    element: <InsightsPage />,
  },
  {
    path: "/entities",
    element: <EntitiesExplorer />,
  },
  {
    path: "/entities/:id",
    element: <EntityDetail />,
  },
  {
    path: "/admin/verification",
    element: <DatasetVerificationPage />,
  },
]);

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
