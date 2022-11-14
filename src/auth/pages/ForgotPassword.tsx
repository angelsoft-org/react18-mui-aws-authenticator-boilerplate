import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import {
  Alert,
  Container,
  Typography,
  Box,
  Backdrop,
  CircularProgress,
  Button,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { Auth } from "aws-amplify";
import { useAuthContext } from "../AuthProvider";
import { Visibility, VisibilityOff, ArrowBack as ArrowBackIcon } from "@mui/icons-material";

function PageForgotPassword() {
  const navigate = useNavigate();

  const [{ email }, { setEmail }] = useAuthContext();
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [onReset, setOnReset] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState("");

  ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
    if (value !== password) {
      return false;
    }
    return true;
  });

  const handleSubmit = () => {
    if (!onReset) {
      setLoading(true);
      Auth.forgotPassword(email as string)
        .then(() => {
          setLoading(false);
          setErrorMessage(null);
          setOnReset(true);
        })
        .catch((e) => {
          setLoading(false);
          switch (e.name) {
            case "UserNotFoundException":
              setErrorMessage("User not found");
              break;
            default:
              setErrorMessage(e.message);
          }
        });
    } else {
      setLoading(true);
      Auth.forgotPasswordSubmit(email as string, verifyCode, password)
        .then(() => {
          setLoading(false);
          setErrorMessage(null);
          navigate("/");
        })
        .catch((e) => {
          setLoading(false);
          setErrorMessage(e.message);
        });
    }
  };

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
            Reset your password
          </Typography>
          <Typography variant="h6" className="auth-left auth-left--title-s">
            Send verification code to your Email
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
                  sx={{ fontSize: "1.6rem" }}
                  gutterBottom
                  align="center"
                  className="auth-header-title"
                >
                  Reset Password
                </Typography>
                <div className="signup-link">
                  <ArrowBackIcon className="auth-link-arrow" />
                  <NavLink to="/">Go back</NavLink>
                </div>
              </div>
              <div className="divider-line"></div>
            </div>
            <ValidatorForm onSubmit={handleSubmit}>
              {!onReset && (
                <TextValidator
                  variant="outlined"
                  fullWidth
                  name="email"
                  label="Email"
                  validators={["required", "isEmail"]}
                  errorMessages={["This field is required", "Email is not valid"]}
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value);
                  }}
                ></TextValidator>
              )}
              {onReset && (
                <>
                  <Box mb={2}>
                    <TextValidator
                      autoComplete="off"
                      variant="outlined"
                      name="code"
                      fullWidth
                      label="Enter your code"
                      validators={["required"]}
                      errorMessages={["This field is required"]}
                      value={verifyCode}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setVerifyCode(e.target.value.replace(/\D/g, ""));
                      }}
                    ></TextValidator>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextValidator
                        variant="outlined"
                        fullWidth
                        name="password"
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
                        name="confirm-password"
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
                </>
              )}
              {errorMessage && (
                <Box mt={onReset ? 0 : 2}>
                  <Alert variant="outlined" severity="error">
                    {errorMessage}
                  </Alert>
                </Box>
              )}
              <Box mt={3}>
                <Button type="submit" size="large" fullWidth variant="contained">
                  {onReset ? `Reset Password` : `SEND CODE`}
                </Button>
              </Box>
            </ValidatorForm>
          </Container>
        </Grid>
      </Grid>
    </div>
  );
}

export default PageForgotPassword;
