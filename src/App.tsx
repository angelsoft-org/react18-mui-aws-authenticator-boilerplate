import React, { useEffect } from "react";
// import { useDispatch } from "react-redux";
import Authenticator from "./auth/Authenticator";
import { Amplify, Auth, Hub } from "aws-amplify";
import config from "./config";
import { useAuthenticator } from "./auth";

Amplify.configure(config.AWS);

function App() {
  const [{ isAuthenticating }, { setAuthenticated, setIsAuthenticating }] = useAuthenticator();
  // const dispatch = useDispatch();
  const listener = async (data: any) => {
    switch (data.payload.event) {
      case "signIn":
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
        localStorage.setItem(config.AUTH.AUTH_USER_TOKEN_KEY, token);
        break;
      case "tokenRefresh_failure":
        // console.log("token refresh failed");
        break;
      case "configured":
        // console.log("the Auth module is configured");
        // console.log(data);
        break;
      default:
    }
  };

  const startUpdateAccessTokenUsingRefreshToken = () => {
    // console.log("startUpdateAccessToken");
    const timer = setInterval(async () => {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      const { refreshToken } = cognitoUser.getSignInUserSession();
      cognitoUser.refreshSession(refreshToken, (err: any, session: { accessToken: { jwtToken: string } }) => {
        if (err) {
          clearTimeout(timer);
          Auth.signOut();
        } else {
          localStorage.setItem(config.AUTH.AUTH_USER_TOKEN_KEY, session?.accessToken?.jwtToken);
        }
      });
    }, 5 * 1000 * 60); // refresh token in 4 minutes as it's expired in 1 hour
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
            localStorage.setItem(config.AUTH.AUTH_USER_TOKEN_KEY, session?.accessToken?.jwtToken);
            setAuthenticated && setAuthenticated(true);
            setIsAuthenticating && setIsAuthenticating(false);
            // dispatch(signIn(user));
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

  return (
    <Authenticator amplifyConfig={config.AWS}>
      <div className="App">
        <header className="App-header"></header>
      </div>
    </Authenticator>
  );
}

export default App;
