import React, { createContext, useContext, useState, ReactNode } from "react";

export type Role = "admin" | "employee";

import { AppPermissions, DEFAULT_ADMIN_PERMISSIONS, DEFAULT_EMPLOYEE_PERMISSIONS } from "@/types/permissions";

export type { AppPermissions as UserPermissions };

interface AuthContextType {
  user: {
    name: string;
    role: Role;
    permissions: AppPermissions;
  };
  setRole: (role: Role) => void;
  updatePermissions: (perms: Partial<AppPermissions>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("admin");
  const [permissions, setPermissions] = useState<AppPermissions>(DEFAULT_ADMIN_PERMISSIONS);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    setPermissions(newRole === "admin" ? DEFAULT_ADMIN_PERMISSIONS : DEFAULT_EMPLOYEE_PERMISSIONS);
  };

  const updatePermissions = (perms: Partial<AppPermissions>) => {
    setPermissions((prev) => ({ ...prev, ...perms }));
  };

  return (
    <AuthContext.Provider value={{ user: { name: "Admin", role, permissions }, setRole, updatePermissions }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
