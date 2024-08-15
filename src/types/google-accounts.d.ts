interface GoogleIdResponse {
    credential: string;
  }
  
  interface GoogleAccountsId {
    initialize(config: {
      client_id: string;
      callback: (response: GoogleIdResponse) => void;
    }): void;
    prompt(): void;
  }
  
  interface GoogleAccounts {
    id: GoogleAccountsId;
  }
  
  declare global {
    interface Window {
      google: GoogleAccounts;
    }
  }