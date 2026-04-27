/**
 * Evolution API Client
 * Documentação: https://doc.evolution-api.com/
 */

const API_URL = import.meta.env.VITE_EVOLUTION_API_URL || "";
const API_KEY = import.meta.env.VITE_EVOLUTION_API_KEY || "";

export interface Instance {
  instanceName: string;
  instanceId: string;
  status: "open" | "close" | "connecting";
  owner?: string;
  profileName?: string;
  profilePictureUrl?: string;
}

export const evolution = {
  async getInstances() {
    const res = await fetch(`${API_URL}/instance/fetchInstances`, {
      headers: {
        "apikey": API_KEY,
      },
    });
    if (!res.ok) throw new Error("Falha ao buscar instâncias da Evolution API");
    return res.json() as Promise<Instance[]>;
  },

  async createInstance(instanceName: string) {
    const res = await fetch(`${API_URL}/instance/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": API_KEY,
      },
      body: JSON.stringify({
        instanceName,
        token: "", // Gerado automaticamente se vazio
        qrcode: true,
      }),
    });
    return res.json();
  },

  async getQrCode(instanceName: string) {
    const res = await fetch(`${API_URL}/instance/connect/${instanceName}`, {
      headers: {
        "apikey": API_KEY,
      },
    });
    return res.json();
  },

  async logoutInstance(instanceName: string) {
    const res = await fetch(`${API_URL}/instance/logout/${instanceName}`, {
      method: "DELETE",
      headers: {
        "apikey": API_KEY,
      },
    });
    return res.json();
  },

  async deleteInstance(instanceName: string) {
    const res = await fetch(`${API_URL}/instance/delete/${instanceName}`, {
      method: "DELETE",
      headers: {
        "apikey": API_KEY,
      },
    });
    return res.json();
  }
};
