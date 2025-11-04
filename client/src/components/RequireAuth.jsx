// client/src/components/RequireAuth.jsx
import { Navigate, useLocation } from "react-router-dom";
import { isAuthed, hasAnyRole } from "../utils/auth";

export function RequireAuth({ children, redirect = "/login" }) {
  const authed = isAuthed();
  const loc = useLocation();

  if (!authed) {
    const next = encodeURIComponent(loc.pathname + loc.search);
    return <Navigate to={`${redirect}?next=${next}`} replace />;
  }
  return children;
}

export function RequireRole({ roles = [], children }) {
  const allowed = hasAnyRole(roles);
  if (!allowed) {
    return <Navigate to="/" replace />;
  }
  return children;
}
