type configTypes = {
  BASE_URL: string;
  IMAGE_CDN_URL: string;
  RAZORPAY_KEY: string;
  VIDEO_CDN_URL: string;
  HOSTED_URL: string;
};

const config: configTypes = {
  BASE_URL: "https://splay.ngrok.app",
  IMAGE_CDN_URL: "https://skara-imagecontent-staging.b-cdn.net",
  VIDEO_CDN_URL: "https://splay-staging.b-cdn.net",
  RAZORPAY_KEY: "rzp_test_WiE3HUeTk2gRbX",
  HOSTED_URL: "https://splay-staging.vercel.app",
};

export default config;
