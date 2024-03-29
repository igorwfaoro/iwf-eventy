namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;

    GOOGLE_API_KEY: string;

    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;

    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;

    S3_API_VERSION: string;
    S3_ACCESS_KEY: string;
    S3_SECRET_ACCESS_KEY: string;
    S3_BUCKET: string;
    S3_URL: string;
  }
}
