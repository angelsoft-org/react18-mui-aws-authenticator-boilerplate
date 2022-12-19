import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Alert, Container, Typography, Box, Backdrop, CircularProgress, Button, Grid } from "@mui/material";
import { Auth } from "aws-amplify";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuthContext } from "../AuthProvider";

function PageVerifyAccount() {
  const navigate = useNavigate();

  const [{ verifyEmail }, { setVerifyEmail }] = useAuthContext();

  const form = useRef<ValidatorForm>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    Auth.confirmSignUp(verifyEmail as string, verifyCode)
      .then(() => {
        setLoading(false);
        navigate("/");
        setVerifyEmail("");
      })
      .catch((e) => {
        setErrorMessage(e.message);
        console.log(e);
        switch (e.name) {
          case "NotAuthorizedException":
            navigate("/");
            break;
          case "UserNotFoundException":
            navigate("/");
            break;
          case "CodeMismatchException":
            break;
          default:
        }
        setLoading(false);
      });
  };

  const resendVerifyCode = () => {
    if (form.current) form.current?.resetValidations();
    Auth.resendSignUp(verifyEmail as string)
      .then((res) => {
        console.log(res);
        setLoading(false);
        setErrorMessage("");
        setSuccessMessage(`We resent the verification code to your email ${res?.CodeDeliveryDetails?.Destination}.`);
      })
      .catch((e) => {
        setSuccessMessage("");
        setErrorMessage(e.message);
        console.log(e.name);
        switch (e.name) {
          case "UserNotFoundException":
            navigate("/");
            break;
          default:
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!verifyEmail) {
      navigate("/");
    }
  }, [navigate, verifyEmail]);

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
            We Emailed You
          </Typography>
          <Typography variant="h6" className="auth-left auth-left--title-s">
            Your code is on the way, To sign in, enter the code we verifyEmailed to you. It may take a minute to arrive
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} lg={8} sx={{ margin: "auto" }}>
          <Container maxWidth="sm">
            <div className="auth-header">
              <div className="auth-app--logo">
                <img src="/images/logo-black.png" alt="" width="100%" />
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
                  Verify Code
                </Typography>
                <div className="signup-link">
                  <ArrowBackIcon className="auth-link-arrow" />
                  <NavLink to="/">Back to Sign In</NavLink>
                </div>
              </div>
              <div className="divider-line"></div>
            </div>
            <ValidatorForm onSubmit={handleSubmit} ref={form}>
              <TextValidator
                autoComplete="off"
                variant="outlined"
                fullWidth
                name="verify-code"
                label="Enter your code"
                validators={["required"]}
                errorMessages={["This field is required"]}
                value={verifyCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setVerifyCode(e.target.value.replace(/\D/g, ""));
                }}
              ></TextValidator>
              {errorMessage && (
                <Box mb={2} mt={2}>
                  <Alert variant="outlined" severity="error">
                    {errorMessage}
                  </Alert>
                </Box>
              )}
              {successMessage && (
                <Box mb={2} mt={2}>
                  <Alert variant="outlined" severity="success">
                    {successMessage}
                  </Alert>
                </Box>
              )}
              <Box mt={3}>
                <Button type="submit" size="large" fullWidth variant="contained">
                  CONFIRM
                </Button>
              </Box>
              <Box mt={2}>
                <Button size="large" fullWidth variant="outlined" onClick={resendVerifyCode}>
                  RESEND CODE
                </Button>
              </Box>
            </ValidatorForm>
          </Container>
          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            Copyright ©2022 OpenZNet, Inc. All Rights Reserved.
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export default PageVerifyAccount;
