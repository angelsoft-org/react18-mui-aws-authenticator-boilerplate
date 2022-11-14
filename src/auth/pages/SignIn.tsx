import React, { useState } from "react";
import { Auth } from "aws-amplify";
// import { Auth } from 'aws-amplify';
// import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import IconVisibility from "@mui/icons-material/Visibility";
import IconVisibilityOff from "@mui/icons-material/VisibilityOff";
import IconArrowForward from "@mui/icons-material/ArrowForward";
import { useAuthContext } from "../AuthProvider";

function PageSignIn() {
  const navigate = useNavigate();
  const [{ email, password }, { setEmail, setPassword, setVerifyEmail, setAuthenticated, setIsAuthenticating }] =
    useAuthContext();

  const [isLoading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = () => {
    setLoading(true);
    setErrorMessage("");
    Auth.signIn(email as string, password as string)
      .then((cognitoUser) => {
        switch (cognitoUser.challengeName) {
          case "NEW_PASSWORD_REQUIRED":
            navigate("/changepassword");
            return;
          default:
        }
        window.localStorage.setItem("LOGIN_ACTION", "1");
        setEmail("");
        setPassword("");
        // dispatch(
        //   signIn({
        //     username: cognitoUser.username,
        //     attributes: cognitoUser.attributes,
        //   })
        // );
        setAuthenticated && setAuthenticated(true);
        setIsAuthenticating && setIsAuthenticating(false);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(err.message);
        switch (err.name) {
          case "UserNotFoundException":
            break;
          case "UserNotConfirmedException":
            setVerifyEmail(email as string);
            navigate("/verify");
            break;
          default:
        }
        setAuthenticated && setAuthenticated(false);
        setIsAuthenticating && setIsAuthenticating(false);
        setLoading(false);
      });
  };

  return (
    <div className="auth-page-wrapper">
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container>
        <Grid item xs={12} md={6} lg={4} className="auth-background">
          <div className="auth-left-logo">
            <img src="/images/logo-white.png" alt="" width="100%" />
          </div>
          <Typography variant="h4" className="auth-left auth-left--title-b">
            Welcome to OpenZNet
          </Typography>
          <Typography variant="h6" className="auth-left auth-left--title-s">
            Please sign in to continue
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} lg={8} sx={{ margin: "auto" }}>
          <Container maxWidth="sm">
            <div className="auth-header">
              <div className="auth-app--logo">
                <img src="/images/logo-black.png" alt="" />
              </div>
              <div className="auth-header-bar">
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  align="center"
                  mb={3}
                  className="auth-header-title"
                >
                  Sign in
                </Typography>
                <div className="signup-link">
                  <IconArrowForward className="auth-link-arrow" />
                  <NavLink to="/signup">Create account</NavLink>
                </div>
              </div>
              <div className="divider-line"></div>
            </div>
            <ValidatorForm onSubmit={handleSubmit}>
              <TextValidator
                variant="outlined"
                fullWidth
                name="email"
                size="medium"
                label="Email"
                validators={["required", "isEmail"]}
                errorMessages={["This field is required", "Email is not valid"]}
                value={email}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail && setEmail(event.target.value);
                }}
                sx={{ mb: 2 }}
              ></TextValidator>
              <TextValidator
                variant="outlined"
                fullWidth
                size="medium"
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword && setPassword(e.target.value)}
                validators={["required"]}
                errorMessages={["This field is required"]}
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        sx={{ color: "#7f7f7f" }}
                      >
                        {showPassword ? <IconVisibilityOff /> : <IconVisibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              ></TextValidator>
              {errorMessage && (
                <Box mb={2}>
                  <Alert variant="outlined" severity="error">
                    {errorMessage}
                  </Alert>
                </Box>
              )}
              <Grid container mb={4}>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setRememberMe(event.target.checked)}
                      />
                    }
                    color="secondary"
                    label="Remember me"
                    sx={{ color: "#7f7f7f" }}
                  />
                </Grid>
                <Grid item xs={6} display="flex" justifyContent="flex-end">
                  <Button className="auth-link" onClick={() => navigate("/forgotpassword")}>
                    Forgot password?
                  </Button>
                </Grid>
              </Grid>
              <Button type="submit" fullWidth size="large" variant="contained">
                SIGN IN
              </Button>
            </ValidatorForm>
          </Container>
        </Grid>
      </Grid>
    </div>
  );
}

export default PageSignIn;
