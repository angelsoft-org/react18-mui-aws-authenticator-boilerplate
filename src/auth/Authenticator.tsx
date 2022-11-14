import React from "react";
import AuthRoutes from "./AuthRoutes";
import { useAuthContext } from "./AuthProvider";
// import { useAuthContext } from "./AuthProvider";

interface AWSAmplifyConfig {
  aws_project_region: string | undefined;
  aws_cognito_identity_pool_id: string | undefined;
  aws_cognito_region: string | undefined;
  aws_user_pools_id: string | undefined;
  aws_user_pools_web_client_id: string | undefined;
  oauth: {
    domain: string | undefined;
    scope: string[] | undefined;
    redirectSignIn: string | undefined;
    redirectSignOut: string | undefined;
    responseType: string | undefined;
  };
  federationTarget: string | undefined;
}

type AuthenticatorProps = {
  children: React.ReactNode;
  amplifyConfig: AWSAmplifyConfig;
};

function Authenticator(props: AuthenticatorProps) {
  const [{ authenticated }] = useAuthContext();

  if (!authenticated) {
    return <AuthRoutes></AuthRoutes>;
  }

  return <div>{props.children}</div>;
}

export default Authenticator;
