interface Window {
  grecaptcha: {
    reset: () => void;
    execute: (siteKey: string, options: { action: string }) => Promise<string>;
  };
}
