import { Box, Button, Container, Typography, useTheme, alpha, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { NavLink } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HomeIcon from "@mui/icons-material/Home";

// Styled components for custom styling
const NotFoundContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(
    theme.palette.secondary.light,
    0.05
  )} 100%)`,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    background: `radial-gradient(circle, ${alpha(
      theme.palette.primary.main,
      0.03
    )} 1px, transparent 1px)`,
    backgroundSize: "50px 50px",
    animation: "float 20s linear infinite",
  },
  "@keyframes float": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
}));

const NotFoundCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  textAlign: "center",
  maxWidth: "600px",
  borderRadius: "24px",
  backdropFilter: "blur(10px)",
  backgroundColor: alpha(theme.palette.background.paper, 0.85),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.15)}`,
  position: "relative",
  zIndex: 1,
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: `0 25px 70px ${alpha(theme.palette.common.black, 0.2)}`,
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(4),
    margin: theme.spacing(2),
  },
}));

const ErrorIcon = styled(ErrorOutlineIcon)(({ theme }) => ({
  fontSize: "120px",
  color: theme.palette.error.main,
  marginBottom: theme.spacing(2),
  filter: "drop-shadow(0 4px 12px rgba(244, 67, 54, 0.3))",
  animation: "pulse 2s infinite",
  "@keyframes pulse": {
    "0%": {
      transform: "scale(1)",
      opacity: 1,
    },
    "50%": {
      transform: "scale(1.05)",
      opacity: 0.9,
    },
    "100%": {
      transform: "scale(1)",
      opacity: 1,
    },
  },
}));

const ErrorCode = styled(Typography)(({ theme }) => ({
  fontSize: "8rem",
  fontWeight: 900,
  background: `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.warning.main})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  marginBottom: theme.spacing(1),
  textShadow: `0 4px 8px ${alpha(theme.palette.error.main, 0.2)}`,
  lineHeight: 1,
  [theme.breakpoints.down("sm")]: {
    fontSize: "6rem",
  },
}));

const HomeButton = styled(Button)(({ theme }) => ({
  borderRadius: "50px",
  padding: theme.spacing(1.5, 4),
  fontSize: "1.1rem",
  fontWeight: 600,
  textTransform: "none",
  marginTop: theme.spacing(4),
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: "white",
  boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
  transition: "all 0.3s ease",
  "&:hover": {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
    boxShadow: `0 10px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
    transform: "translateY(-2px)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
}));

const NotFound = () => {
  const theme = useTheme();

  return (
    <NotFoundContainer>
      <Container maxWidth="md">
        <NotFoundCard elevation={0}>
          <ErrorIcon />

          <ErrorCode variant="h1">404</ErrorCode>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              marginBottom: theme.spacing(2),
              [theme.breakpoints.down("sm")]: {
                fontSize: "1.75rem",
              },
            }}
          >
            Page Not Found
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "1.1rem",
              lineHeight: 1.6,
              maxWidth: "500px",
              margin: "0 auto",
              marginBottom: theme.spacing(1),
            }}
          >
            Oops! The page you're looking for seems to have wandered off into the digital unknown.
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.disabled,
              marginBottom: theme.spacing(4),
              fontStyle: "italic",
            }}
          >
            Don't worry, even the best explorers sometimes take wrong turns.
          </Typography>

          <NavLink to="/" style={{ textDecoration: "none" }}>
            <HomeButton variant="contained" startIcon={<HomeIcon />} size="large">
              Return to Home Page
            </HomeButton>
          </NavLink>

          <Box
            sx={{
              marginTop: theme.spacing(6),
              display: "flex",
              justifyContent: "center",
              gap: theme.spacing(4),
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.disabled,
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(0.5),
              }}
            >
              <Box
                component="span"
                sx={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: theme.palette.success.main,
                  display: "inline-block",
                }}
              />
              Check the URL for typos
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.disabled,
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(0.5),
              }}
            >
              <Box
                component="span"
                sx={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: theme.palette.info.main,
                  display: "inline-block",
                }}
              />
              Use the navigation menu
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.disabled,
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(0.5),
              }}
            >
              <Box
                component="span"
                sx={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: theme.palette.warning.main,
                  display: "inline-block",
                }}
              />
              Contact support if needed
            </Typography>
          </Box>
        </NotFoundCard>
      </Container>
    </NotFoundContainer>
  );
};

export default NotFound;
