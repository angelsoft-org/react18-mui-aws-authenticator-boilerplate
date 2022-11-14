// import { useDispatch } from "react-redux";
import Authenticator from "./auth/Authenticator";
import { Amplify } from "aws-amplify";
import config from "./config";

Amplify.configure(config.AWS);

function App() {
  // const dispatch = useDispatch();

  return (
    <Authenticator
      authUserTokenKey={config.AUTH.AUTH_USER_TOKEN_KEY || "OPENZNET_AWS_AMPLIFY_JWT_ACCESS_TOKEN"}
      services={{
        onSignIn: (info) => {
          console.log(info);
        },
      }}
      roles={config.AUTH.AUTH_USER_ROLES}
    >
      <div className="App">
        <header className="App-header"> as dasd asd </header>
      </div>
    </Authenticator>
  );
}

export default App;
