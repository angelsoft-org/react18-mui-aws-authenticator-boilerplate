import React, { useReducer, useContext, createContext, useMemo } from "react";

type State = {
  [x: string]: string | boolean;
};

type Actions = {
  setIsAuthenticating: (value: boolean) => void;
  setAuthenticated: (value: boolean) => void;
  setEmail: (value: string) => void;
  setVerifyEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
};

const INIT_STATE = {
  isAuthenticating: true,
  authenticated: false,
  email: "",
  password: "",
  verifyEmail: "",
};

const AuthContext = createContext<[State, Actions]>([
  INIT_STATE,
  {
    setIsAuthenticating: (value: boolean) => {},
    setAuthenticated: (value: boolean) => {},
    setEmail: (value: string) => {},
    setVerifyEmail: (value: string) => {},
    setPassword: (value: string) => {},
    setConfirmPassword: (value: string) => {},
  },
]);
AuthContext.displayName = "AuthContext";

function reducer(state: object, { type, payload }: { type: string; payload: string | boolean }) {
  return {
    ...state,
    [type]: payload,
  };
}

type ProviderProps = {
  children: React.ReactNode;
};

const AuthContextProvider = (props: ProviderProps) => {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);

  const setIsAuthenticating = (value: boolean): void => dispatch({ type: "isAuthenticating", payload: value });
  const setAuthenticated = (value: boolean): void => dispatch({ type: "authenticated", payload: value });
  const setEmail = (value: string): void => dispatch({ type: "email", payload: value });
  const setVerifyEmail = (value: string): void => dispatch({ type: "verifyEmail", payload: value });
  const setPassword = (value: string): void => dispatch({ type: "password", payload: value });
  const setConfirmPassword = (value: string): void => dispatch({ type: "password", payload: value });

  return (
    <AuthContext.Provider
      value={useMemo(
        () => [
          state,
          { setAuthenticated, setIsAuthenticating, setEmail, setVerifyEmail, setPassword, setConfirmPassword },
        ],
        [state]
      )}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }
  return context;
};

export { AuthContextProvider, useAuthContext };
