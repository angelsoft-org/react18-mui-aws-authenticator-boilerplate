const ENV = process.env;

const AWS = {
  aws_project_region: ENV.REACT_APP_AWS_REGION,
  aws_cognito_identity_pool_id: ENV.REACT_APP_COGNITO_IDENTITY_POOL_ID,
  aws_cognito_region: ENV.REACT_APP_AWS_REGION,
  aws_user_pools_id: ENV.REACT_APP_COGNITO_USER_POOL_ID,
  aws_user_pools_web_client_id: ENV.REACT_APP_COGNITO_USER_POOL_CLIENT_ID,
  oauth: {
    domain: ENV.REACT_APP_COGNITO_OAUTH_DOMAIN,
    scope: ["email", "openid", "profile"],
    redirectSignIn: ENV.REACT_APP_COGNITO_OAUTH_REDIRECT_SIGN_IN,
    redirectSignOut: ENV.REACT_APP_COGNITO_OAUTH_REDIRECT_SIGN_OUT,
    responseType: "token",
  },
  federationTarget: "COGNITO_USER_AND_IDENTITY_POOLS",
};
const AUTH_USER_TOKEN_KEY = "ReactAmplify.TokenKey";
const AUTH_USER_ROLES = [
  {
    type: "System Administrator",
    value: "sysadmin",
  },
];

const config = { AWS, AUTH: { AUTH_USER_TOKEN_KEY, AUTH_USER_ROLES } };

export default config;
