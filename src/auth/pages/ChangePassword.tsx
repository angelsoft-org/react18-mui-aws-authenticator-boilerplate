import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
// import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from "react-router-dom";
import {
  Alert,
  InputAdornment,
  Grid,
  IconButton,
  Container,
  Typography,
  Box,
  Backdrop,
  CircularProgress,
  Button,
} from "@mui/material";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { Visibility, VisibilityOff, ArrowBackIosNew as ArrowBackwardIcon } from "@mui/icons-material";
import { useAuthContext } from "../AuthProvider";

function PageChangePassword() {
  const navigate = useNavigate();
  const [{ email, password }, { setPassword }] = useAuthContext();

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setLoading] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleClickVisiblePassword = () => {
    setVisiblePassword(!visiblePassword);
  };

  const handleSubmit = () => {
    setLoading(true);
    Auth.signIn(email as string, password as string)
      .then((user) => {
        Auth.completeNewPassword(user, form.newPassword)
          .then(() => {
            setPassword("");
            navigate("/");
          })
          .catch(() => {
            setForm({
              newPassword: "",
              confirmPassword: "",
            });
            setErrorMessage("Unknown error was occurred");
          })
          .then(() => {
            setLoading(false);
          });
      })
      .catch(() => {
        setPassword("");
        navigate("/");
      });
  };

  ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
    if (value !== form.newPassword) {
      return false;
    }
    return true;
  });

  useEffect(() => {
    if (!email || !password) navigate("/");
  }, [navigate]); //eslint-disable-line

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
            Change Password
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
                  Change Password
                </Typography>
                <div className="signup-link">
                  <ArrowBackwardIcon className="auth-link-arrow" />
                  <NavLink to="/">Back to Sign In</NavLink>
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
                value={email}
                sx={{ mb: 2 }}
                disabled
              ></TextValidator>
              <TextValidator
                variant="outlined"
                fullWidth
                name="password"
                size="medium"
                label="Password"
                type={visiblePassword ? "text" : "password"}
                value={form.newPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, newPassword: e.target.value })}
                validators={["required"]}
                errorMessages={["This field is required"]}
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickVisiblePassword}
                        edge="end"
                        sx={{ color: "#7f7f7f" }}
                      >
                        {visiblePassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              ></TextValidator>
              <TextValidator
                variant="outlined"
                fullWidth
                name="confirm-password"
                size="medium"
                label="Confirm Password"
                type={visiblePassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                validators={["isPasswordMatch", "required"]}
                errorMessages={["Password mismatch", "this field is required"]}
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickVisiblePassword}
                        edge="end"
                        sx={{ color: "#7f7f7f" }}
                      >
                        {visiblePassword ? <VisibilityOff /> : <Visibility />}
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
              <Button type="submit" fullWidth size="large" variant="contained">
                Change Password
              </Button>
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

export default PageChangePassword;
