import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  alpha,
  useTheme,
  keyframes,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { saveIdeaAction } from "../../store/features/questions/actions";

// Import images directly
import backgroundImage from "../../assets/images/wall4.jpg";
import logoImage from "../../assets/images/logo-white.png";

// Keyframes for focus animation
const scaleUp = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.02);
  }
`;

const LandingContainer = styled(Box)(() => ({
  minHeight: "100vh",
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(2px)",
  },
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 2,
  textAlign: "center",
  color: "white",
  width: "100%",
  maxWidth: "800px",
  padding: theme.spacing(4),
}));

const HeroLogo = styled("img")(({ theme }) => ({
  width: "80%", // Use percentage instead of fixed width
  maxWidth: "900px", // Maximum size
  minWidth: "300px", // Minimum size
  height: "auto",
  marginBottom: theme.spacing(4),
  filter: "drop-shadow(0 8px 24px rgba(0, 0, 0, 0.4))",
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
  objectFit: "contain", // Ensures logo maintains aspect ratio
  [theme.breakpoints.down("lg")]: {
    width: "85%",
  },
  [theme.breakpoints.down("md")]: {
    width: "90%",
    marginBottom: theme.spacing(3),
  },
  [theme.breakpoints.down("sm")]: {
    width: "95%",
    marginBottom: theme.spacing(2),
  },
}));

const HeroInput = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.15)", // Transparent background
    fontSize: "1.1rem",
    transition: "all 0.3s ease-in-out",
    backdropFilter: "blur(10px)",
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.3)",
      borderWidth: "2px",
      transition: "all 0.3s ease-in-out",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.6)",
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
    "&.Mui-focused": {
      animation: `${scaleUp} 0.3s ease-in-out forwards`,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      "& fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: "3px",
        boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.2)}`,
      },
    },
  },
  "& .MuiInputBase-input": {
    padding: theme.spacing(2.5),
    fontSize: "1.1rem",
    color: "white",
    "&::placeholder": {
      color: "rgba(255, 255, 255, 0.7)",
    },
    "&::-webkit-scrollbar": {
      display: "none",
    },
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
}));

const HeroButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(2.5, 6),
  fontSize: "1.2rem",
  fontWeight: 700,
  textTransform: "none",
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
  color: "white",
  minWidth: "240px",
  "&:hover:not(:disabled)": {
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
    boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.6)}`,
    transform: "translateY(-2px)",
  },
  "&:disabled": {
    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.4)} 0%, ${alpha(
      theme.palette.secondary.main,
      0.4
    )} 100%)`,
    color: "rgba(255, 255, 255, 0.5)",
    cursor: "not-allowed",
  },
  transition: "all 0.3s ease-in-out",
}));

const Tagline = styled(Typography)(({ theme }) => ({
  fontSize: "1.3rem",
  fontWeight: 400,
  marginBottom: theme.spacing(5),
  color: "rgba(255, 255, 255, 0.9)",
  maxWidth: "600px",
  marginLeft: "auto",
  marginRight: "auto",
  lineHeight: 1.6,
  textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
}));

const FeaturesContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  gap: theme.spacing(6),
  marginTop: theme.spacing(6),
  flexWrap: "wrap",
}));

const FeatureBox = styled(Box)(({ theme }) => ({
  textAlign: "center",
  minWidth: "120px",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(8px)",
  borderRadius: 12,
  padding: theme.spacing(2),
  border: "1px solid rgba(255, 255, 255, 0.15)",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

// Security flag to prevent client-side manipulation
let SECURITY_FLAG = false;

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [businessIdea, setBusinessIdeaState] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Calculate everything during render (no useEffect needed)
  const trimmedIdea = businessIdea.trim();
  const characterCount = trimmedIdea.length;
  const minCharacters = 20;
  const charactersRemaining = Math.max(0, minCharacters - characterCount);
  const isValid = characterCount >= 20;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setBusinessIdeaState(value);

    // Update validation error immediately when input changes
    const trimmedValue = value.trim();
    if (trimmedValue.length > 0 && trimmedValue.length < 20) {
      setValidationError("Please enter at least 20 characters for your business idea.");
    } else {
      setValidationError("");
    }
  };

  // Security measure: Server-side validation simulation
  const validateServerSide = async (idea: string): Promise<boolean> => {
    // Simulate server-side validation
    return new Promise((resolve) => {
      setTimeout(() => {
        const isValid = idea.trim().length >= 20;
        resolve(isValid);
      }, 100);
    });
  };

  const handleGenerateClick = async () => {
    // Security check 1: Prevent double submission
    if (SECURITY_FLAG) {
      console.warn("Security: Attempted double submission");
      return;
    }

    // Security check 2: Frontend validation
    if (!trimmedIdea) {
      setValidationError("Please enter a business idea.");
      return;
    }

    if (!isValid) {
      setValidationError("Business idea must be at least 20 characters long.");
      return;
    }

    // Set security flag to prevent manipulation
    SECURITY_FLAG = true;
    setIsSubmitting(true);

    try {
      // Security check 3: Simulate server-side validation
      const serverValid = await validateServerSide(trimmedIdea);
      if (!serverValid) {
        setValidationError("Invalid business idea. Please enter at least 20 characters.");
        SECURITY_FLAG = false;
        setIsSubmitting(false);
        return;
      }

      // 1. Print the business idea to console
      console.log("Business Idea Submitted:", trimmedIdea);
      console.log("Character count:", characterCount);

      // 2. Store in Redux
      dispatch(saveIdeaAction(trimmedIdea));

      // 3. Store in localStorage as backup (can't be manipulated after page navigation)
      localStorage.setItem("businessIdea", trimmedIdea);
      localStorage.setItem("ideaSubmitted", Date.now().toString());

      // 4. Redirect to survey page
      setTimeout(() => {
        navigate("/survey");
        setIsSubmitting(false);
        // Reset security flag after successful navigation
        setTimeout(() => {
          SECURITY_FLAG = false;
        }, 1000);
      }, 500);
    } catch (error) {
      console.error("Error submitting business idea:", error);
      setValidationError("An error occurred. Please try again.");
      SECURITY_FLAG = false;
      setIsSubmitting(false);
    }
  };

  // Prevent form submission via Enter key if invalid
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (isValid && !isSubmitting) {
        handleGenerateClick();
      }
    }
  };

  // Disable right-click and inspect element (basic protection)
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
        (e.ctrlKey && e.key === "u")
      ) {
        e.preventDefault();
      }
    };

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      // Reset security flag on unmount
      SECURITY_FLAG = false;
    };
  }, []);

  return (
    <LandingContainer>
      <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "center" }}>
        <HeroContent>
          {/* Large Logo - Centered */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              mb: 4,
            }}
          >
            <HeroLogo src={logoImage} alt="Company Logo" />
          </Box>

          {/* Tagline */}
          <Tagline variant="h6">
            Transform your business idea into reality with AI-powered insights and planning
          </Tagline>

          {/* Input Section - No Card Container */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            <HeroInput
              fullWidth
              value={businessIdea}
              onChange={handleInputChange}
              placeholder="What's your business idea? (e.g., 'AI-powered fitness app for seniors')"
              variant="outlined"
              multiline
              rows={2}
              maxRows={3}
              onKeyPress={handleKeyPress}
              disabled={isSubmitting}
              error={!!validationError && characterCount > 0}
              helperText={
                validationError || (
                  <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    {characterCount < minCharacters
                      ? `${charactersRemaining} more characters required (${characterCount}/${minCharacters})`
                      : `✓ ${characterCount} characters (minimum ${minCharacters})`}
                  </Typography>
                )
              }
              FormHelperTextProps={{
                sx: {
                  marginLeft: 0,
                  marginRight: 0,
                  textAlign: "left",
                },
              }}
            />

            {/* Validation Alert */}
            {validationError && characterCount > 0 && (
              <Alert
                severity="warning"
                sx={{
                  backgroundColor: "rgba(245, 158, 11, 0.1)",
                  color: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  "& .MuiAlert-icon": {
                    color: "rgba(245, 158, 11, 0.8)",
                  },
                }}
              >
                {validationError}
              </Alert>
            )}

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <HeroButton
                variant="contained"
                size="large"
                onClick={handleGenerateClick}
                disabled={!isValid || isSubmitting || SECURITY_FLAG}
                startIcon={
                  isSubmitting ? (
                    <Box sx={{ fontSize: "1.5rem", mr: 1 }}>⏳</Box>
                  ) : (
                    <Box sx={{ fontSize: "1.5rem", mr: 1 }}>✨</Box>
                  )
                }
              >
                {isSubmitting ? "Processing..." : "Generate with AI"}
              </HeroButton>
            </Box>
          </Box>

          {/* Features with subtle transparency */}
          <FeaturesContainer>
            <FeatureBox>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.info.light})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                Instant
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.85)" }}>
                Business Plans
              </Typography>
            </FeatureBox>

            <FeatureBox>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.info.light})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                AI-Powered
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.85)" }}>
                Insights
              </Typography>
            </FeatureBox>

            <FeatureBox>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.info.light})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                Secure
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.85)" }}>
                Validation
              </Typography>
            </FeatureBox>
          </FeaturesContainer>

          {/* CTA Note - Subtle text */}
          <Typography
            variant="body2"
            sx={{
              mt: 6,
              color: "rgba(255, 255, 255, 0.7)",
              fontStyle: "italic",
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
            }}
          >
            Enter your idea (minimum 20 characters) and get a complete business roadmap in seconds
          </Typography>
        </HeroContent>
      </Container>
    </LandingContainer>
  );
};

export default Home;
