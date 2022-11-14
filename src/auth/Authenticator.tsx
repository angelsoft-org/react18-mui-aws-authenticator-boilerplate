import React, { useEffect } from "react";
import { Auth, Hub } from "aws-amplify";
import { useAuthContext } from "./AuthProvider";
import { Routes, Route, Navigate } from "react-router-dom";
import PageSignIn from "./pages/SignIn";
import PageSignUp from "./pages/SignUp";
import PageForgotPassword from "./pages/ForgotPassword";
import PageVerifyCode from "./pages/VerifyAccount";
import PageChangePassword from "./pages/ChangePassword";

type UserInfo = {
  id: string;
  name: string;
  role: string;
};

type AuthenticatorProps = {
  children: React.ReactElement;
  services: {
    onSignIn?: (user: UserInfo) => void;
  };
  authUserTokenKey: string;
  roles: {
    type: string;
    value: string;
  }[];
};

function Authenticator({ children, services: { onSignIn }, authUserTokenKey, roles }: AuthenticatorProps) {
  const [{ authenticated, isAuthenticating }, { setAuthenticated, setIsAuthenticating }] = useAuthContext();

  const listener = async (data: any) => {
    switch (data.payload.event) {
      case "signIn":
        const { data: userData } = data.payload;
        onSignIn &&
          onSignIn({
            id: userData.username,
            name: userData.attributes.email,
            role: roles[0].value || "user",
          });
        setAuthenticated(true);
        setIsAuthenticating(false);
        break;
      case "signUp":
        break;
      case "signOut":
        setAuthenticated(false);
        setIsAuthenticating(false);
        break;
      case "signIn_failure":
        setAuthenticated(false);
        setIsAuthenticating(false);
        break;
      case "tokenRefresh":
        const session = await Auth.currentSession();
        const token = session.getAccessToken().getJwtToken();
        localStorage.setItem(authUserTokenKey, token);
        break;
      case "tokenRefresh_failure":
        break;
      case "configured":
        break;
      default:
    }
  };

  const startUpdateAccessTokenUsingRefreshToken = () => {
    const timer = setInterval(async () => {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      const { refreshToken } = cognitoUser.getSignInUserSession();
      cognitoUser.refreshSession(refreshToken, (err: any, session: { accessToken: { jwtToken: string } }) => {
        if (err) {
          clearTimeout(timer);
          Auth.signOut();
        } else {
          localStorage.setItem(authUserTokenKey, session?.accessToken?.jwtToken);
        }
      });
    }, 5 * 1000 * 60);
  };

  useEffect(() => {
    Hub.listen("auth", listener);
    startUpdateAccessTokenUsingRefreshToken();
    async function getUserInfo() {
      const user = await Auth.currentUserInfo();
      try {
        const cognitoUser = await Auth.currentAuthenticatedUser();
        const { refreshToken } = cognitoUser.getSignInUserSession();
        cognitoUser.refreshSession(refreshToken, (err: any, session: { accessToken: { jwtToken: string } }) => {
          if (err) {
            Auth.signOut();
          } else {
            localStorage.setItem(authUserTokenKey, session?.accessToken?.jwtToken);
            setAuthenticated(true);
            setIsAuthenticating(false);
            onSignIn &&
              onSignIn({
                id: user.username,
                name: user.attributes.email,
                role: roles[0].value || "user",
              });
          }
        });
      } catch {
        Auth.signOut();
      }
    }
    getUserInfo();
  }, []); //eslint-disable-line

  if (isAuthenticating) {
    return <div></div>;
  }

  if (!authenticated) {
    return (
      <Routes>
        <Route path="/" index element={<PageSignIn></PageSignIn>}></Route>
        <Route path="/signup" element={<PageSignUp></PageSignUp>}></Route>
        <Route path="/forgotpassword" element={<PageForgotPassword></PageForgotPassword>}></Route>
        <Route path="/verify" element={<PageVerifyCode></PageVerifyCode>}></Route>
        <Route path="/changepassword" element={<PageChangePassword></PageChangePassword>}></Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return children;
}

export default Authenticator;
