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

interface Google {
  accounts: {
    id: GoogleAccountsId;
  };
}

interface Window {
  google: Google;
}