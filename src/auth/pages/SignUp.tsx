import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import {
  Alert,
  Container,
  FormControlLabel,
  Typography,
  Box,
  Backdrop,
  CircularProgress,
  Checkbox,
  IconButton,
  Button,
  Grid,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff, ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { useAuthContext } from "../AuthProvider";

function PageSignUp() {
  const navigate = useNavigate();

  const [{ email }, { setEmail, setVerifyEmail }] = useAuthContext();
  const [errorMessage, setErrorMessage] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [userRole, setUserRole] = useState("teacher");
  const [userRole] = useState("teacher");
  const [agree, setAgree] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
    if (value !== password) {
      return false;
    }
    return true;
  });

  const handleSubmit = () => {
    setLoading(true);
    window.localStorage.setItem("userRole", userRole);

    Auth.signUp({ username: email as string, password: password })
      .then(() => {
        setErrorMessage(null);
        setLoading(false);
        setVerifyEmail(email as string);
        navigate("/verify");
      })
      .catch((err) => {
        console.log(err.name, err.message);
        setErrorMessage(err.message);
        switch (err.name) {
          case "InvalidPasswordException":
            break;
          case "UserNotConfirmedException":
            setVerifyEmail(email as string);
            navigate("/verify");
            break;
          default:
        }
        setLoading(false);
      });
  };

  // const handleUserRole = (value) => {
  //   setUserRole(value);
  // };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
            Hello, nice to meet you
          </Typography>
          <Typography variant="h6" className="auth-left auth-left--title-s">
            Just register to join with OpenZnet
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
                  Sign Up
                </Typography>
                <div className="signup-link">
                  <ArrowForwardIcon className="auth-link-arrow" />
                  <NavLink to="/">Already have account?</NavLink>
                </div>
              </div>
              <div className="divider-line"></div>
            </div>
            <ValidatorForm onSubmit={handleSubmit}>
              <TextValidator
                variant="outlined"
                fullWidth
                name="Email"
                label="Email Address"
                validators={["required", "isEmail"]}
                errorMessages={["This field is required", "Email is not valid"]}
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                }}
                sx={{ mb: 2 }}
              ></TextValidator>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextValidator
                    variant="outlined"
                    fullWidth
                    name="Password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    validators={["required"]}
                    errorMessages={["This field is required"]}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                            sx={{ color: "#7f7f7f" }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextValidator
                    variant="outlined"
                    fullWidth
                    name="Confirm Password"
                    label="Confirm Password"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                    validators={["isPasswordMatch", "required"]}
                    errorMessages={["Password mismatch", "this field is required"]}
                    sx={{ mb: 2, width: "100%" }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                            sx={{ color: "#7f7f7f" }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              {errorMessage && (
                <Box mb={2}>
                  <Alert variant="outlined" severity="error">
                    {errorMessage}
                  </Alert>
                </Box>
              )}
              {/* <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={userRole}
                  onChange={(e) => handleUserRole(e.target.value)}
                >
                  <FormControlLabel
                    value="teacher"
                    control={<Radio />}
                    label="Teacher"
                  />
                </RadioGroup>
              </FormControl> */}
              <Box display="flex" alignItems="center" mt={1} mb={4}>
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={agree}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAgree(event.target.checked)}
                      />
                    }
                    color="secondary"
                    label="I agree with the Terms & Conditions"
                  />
                </Box>
              </Box>
              <Button fullWidth type="submit" disabled={!agree} variant="contained" size="large">
                Create Account
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

export default PageSignUp;
