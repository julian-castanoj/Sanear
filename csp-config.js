if (process.env.NODE_ENV === 'development') {
    document.querySelector('meta[http-equiv="Content-Security-Policy"]').setAttribute(
      'content',
      "default-src 'self' *; connect-src 'self' ws://127.0.0.1:57595;"
    );
  }