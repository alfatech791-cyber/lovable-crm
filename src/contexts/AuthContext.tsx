import React, { createContext, useContext, useState, ReactNode } from "react";

export type Role = "admin" | "employee";

export interface UserPermissions {
  leads: boolean;
  funnel: boolean;
  chat: boolean;
  whatsapp: boolean;
  instagram: boolean;
  automation: boolean;
  team: boolean;
  reports: boolean;
  settings: boolean;
  products: boolean;
  dashboard: boolean;
}

export const DEFAULT_EMPLOYEE_PERMISSIONS: UserPermissions = {
  dashboard: true,
  leads: true,
  funnel: true,
  chat: true,
  whatsapp: true,
  instagram: false,
  automation: false,
  team: false,
  reports: false,
  settings: false,
  products: true,
};

export const ADMIN_PERMISSIONS: UserPermissions = {
  dashboard: true,
  leads: true,
  funnel: true,
  chat: true,
  whatsapp: true,
  instagram: true,
  automation: true,
  team: true,
  reports: true,
  settings: true,
  products: true,
};

interface AuthContextType {
  user: {
    name: string;
    role: Role;
    permissions: UserPermissions;
  };
  setRole: (role: Role) => void;
  updatePermissions: (perms: Partial<UserPermissions>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("admin");
  const [permissions, setPermissions] = useState<UserPermissions>(ADMIN_PERMISSIONS);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    setPermissions(newRole === "admin" ? ADMIN_PERMISSIONS : DEFAULT_EMPLOYEE_PERMISSIONS);
  };

  const updatePermissions = (perms: Partial<UserPermissions>) => {
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
