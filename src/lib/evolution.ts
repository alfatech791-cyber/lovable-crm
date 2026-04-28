/**
 * Evolution API Client
 * Documentação: https://doc.evolution-api.com/
 */

// Todas as chamadas passam pelo proxy server route /api/evolution/*
// que injeta a URL e a API key da Evolution API a partir das secrets do servidor.
const API_URL = "/api/evolution";

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
    const res = await fetch(`${API_URL}/instance/fetchInstances`);
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Evolution API Error (fetchInstances):", res.status, errorText);
      throw new Error(`Falha ao buscar instâncias: ${res.status}`);
    }
    return res.json() as Promise<Instance[]>;
  },

   async createInstance(instanceName: string, webhookUrl?: string) {
     const res = await fetch(`${API_URL}/instance/create`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         instanceName,
         token: "",
         qrcode: true,
         webhook: webhookUrl || "",
         webhook_by_events: false,
         events: [
           "MESSAGES_UPSERT",
           "MESSAGES_UPDATE",
           "MESSAGES_DELETE",
           "SEND_MESSAGE",
           "CONTACTS_UPSERT",
           "CONTACTS_UPDATE",
           "PRESENCE_UPDATE",
           "CHATS_UPSERT",
           "CHATS_UPDATE",
           "CHATS_DELETE",
           "GROUPS_UPSERT",
           "GROUPS_UPDATE",
           "GROUP_PARTICIPANTS_UPDATE",
           "CONNECTION_UPDATE",
           "CALL"
         ]
       }),
     });
     return res.json();
   },
 
   async setWebhook(instanceName: string, url: string) {
     const res = await fetch(`${API_URL}/webhook/set/${instanceName}`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         enabled: true,
         url: url,
         webhook_by_events: false,
         events: [
           "MESSAGES_UPSERT",
           "MESSAGES_UPDATE",
           "MESSAGES_DELETE",
           "SEND_MESSAGE",
           "CONTACTS_UPSERT",
           "CONTACTS_UPDATE",
           "PRESENCE_UPDATE",
           "CHATS_UPSERT",
           "CHATS_UPDATE",
           "CHATS_DELETE",
           "GROUPS_UPSERT",
           "GROUPS_UPDATE",
           "GROUP_PARTICIPANTS_UPDATE",
           "CONNECTION_UPDATE",
           "CALL"
         ]
       }),
     });
     return res.json();
   },

   async getQrCode(instanceName: string) {
     try {
       console.log(`Buscando QR Code para: ${instanceName}`);
        const res = await fetch(`${API_URL}/instance/connect/${instanceName}`);
       const data = await res.json();
       console.log("Resposta getQrCode:", data);
       return data;
     } catch (error) {
       console.error("Erro em getQrCode:", error);
       throw error;
     }
   },

  async logoutInstance(instanceName: string) {
    const res = await fetch(`${API_URL}/instance/logout/${instanceName}`, {
      method: "DELETE",
    });
    return res.json();
  },

  async getInstanceConnection(instanceName: string) {
    const res = await fetch(`${API_URL}/instance/connectionState/${instanceName}`);
    return res.json();
  },

  async deleteInstance(instanceName: string) {
    const res = await fetch(`${API_URL}/instance/delete/${instanceName}`, {
      method: "DELETE",
    });
    return res.json();
  }
};

