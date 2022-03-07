import { ENV_PATH_NAME } from 'src/utils';

export interface IConfig {
  Client: {
    Domain: string;
    Port: string;
    AdminDomain: string;
    ClientDomain: string;
  };
  Google: {
    ClientID: string;
    Secret: string;
    CallbackURL: string;
    CallbackAdminURL: string;
  };
  JWT: {
    Secret: string;
    TokenExpiredTime: number;
    RefreshTokenExpiredTime: number;
  };
  BE: {
    AllowOrigins: string[];
  };
}

export const configurations = (): { [ENV_PATH_NAME]: IConfig } => {
  const mode = process.env;

  const allowOrigins = [
    ...(process.env.ADMIN_DOMAIN || '').split(','),
    ...(process.env.CLIENT_DOMAIN || '').split(','),
  ];

  return {
    [ENV_PATH_NAME]: {
      BE: {
        AllowOrigins: allowOrigins,
      },
      Client: {
        Domain: process.env.DOMAIN,
        Port: process.env.PORT,
        AdminDomain: process.env.ADMIN_DOMAIN,
        ClientDomain: process.env.CLIENT_DOMAIN,
      },
      Google: {
        ClientID: process.env.GOOGLE_CLIENT_ID,
        Secret: process.env.GOOGLE_SECRET,
        CallbackURL: process.env.GOOGLE_CALLBACK_URL,
        CallbackAdminURL: process.env.GOOGLE_ADMIN_CALLBACK_URL,
      },
      JWT: {
        Secret: process.env.JWT_SECRET,
        TokenExpiredTime: parseInt(process.env.JWT_TOKEN_EXPIRED_TIME),
        RefreshTokenExpiredTime: parseInt(
          process.env.JWT_REFRESH_TOKEN_EXPIRED_TIME,
        ),
      },
    },
  };
};
