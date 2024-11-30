import RouteGuard from "../components/RouteGuard";
import Home from "./signup";
import OrganizationLayout from "./layouts/OrganizationLayout";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import UnauthorizedScreen from "./UnauthorizedScreen";

export default{
    "/": () => <Home />,
    "/organization": () => (
        <RouteGuard requiredRoles={["organization"]}>
            <OrganizationLayout />
        </RouteGuard>
    ),
    "/user": () => (
        <RouteGuard requiredRoles={["user"]}>
            <UserLayout />
        </RouteGuard>
    ),
    "/admin": () => (
        <RouteGuard requiredRoles={["admin"]}>
            <AdminLayout />
        </RouteGuard>
    ),
    "/Unauthorized": () => <UnauthorizedScreen />,
};
