import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Paper,
  Switch,
  FormControlLabel,
  useTheme,
  alpha,
  styled,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Fade,
} from "@mui/material";
import {
  Check as CheckIcon,
  Star as StarIcon,
  Bolt as BoltIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  AutoAwesome as AutoAwesomeIcon,
  QueryStats as QueryStatsIcon,
  SupportAgent as SupportIcon,
  WorkspacePremium as PremiumIcon,
  ArrowForward as ArrowForwardIcon,
  InfoOutlined as InfoIcon,
} from "@mui/icons-material";

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.9)} 0%, ${alpha(
    theme.palette.secondary.dark,
    0.9
  )} 100%)`,
  color: "white",
  padding: theme.spacing(12, 0),
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `radial-gradient(circle at 20% 50%, ${alpha(
      theme.palette.primary.light,
      0.15
    )} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${alpha(
      theme.palette.secondary.light,
      0.15
    )} 0%, transparent 50%)`,
  },
}));

const PricingCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease-in-out",
  border: `2px solid ${alpha(theme.palette.divider, 0.1)}`,
  borderRadius: "20px",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-12px)",
    boxShadow: `0 30px 60px ${alpha(theme.palette.common.black, 0.15)}`,
    borderColor: alpha(theme.palette.primary.main, 0.3),
  },
}));

const PopularBadge = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  right: 30,
  background: `linear-gradient(45deg, ${theme.palette.warning.main}, ${theme.palette.error.main})`,
  color: "white",
  padding: theme.spacing(0.5, 3),
  borderBottomLeftRadius: "12px",
  borderBottomRightRadius: "12px",
  fontWeight: 700,
  fontSize: "0.875rem",
  zIndex: 1,
}));

const FeatureList = styled(List)(({ theme }) => ({
  "& .MuiListItem-root": {
    padding: theme.spacing(0.5, 0),
  },
  "& .MuiListItemIcon-root": {
    minWidth: "40px",
  },
}));

const PricingGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: theme.spacing(4),
  marginTop: theme.spacing(8),
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
    maxWidth: "500px",
    margin: "0 auto",
  },
}));

const FeaturesGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: theme.spacing(4),
  marginTop: theme.spacing(6),
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
  },
}));

const FAQGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: theme.spacing(4),
  marginTop: theme.spacing(6),
}));

const Subscription = () => {
  const theme = useTheme();
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState("pro");

  const plans = [
    {
      id: "starter",
      name: "Starter",
      icon: <StarIcon />,
      color: theme.palette.info.main,
      price: isAnnual ? "19" : "24",
      period: isAnnual ? "/month" : "/month",
      description: "Perfect for validating your business idea",
      features: [
        "AI Business Plan Generation",
        "Basic Market Analysis",
        "Up to 3 Business Ideas",
        "Standard Support",
        "Monthly Report Generation",
        "Basic Financial Projections",
      ],
      cta: "Start Free Trial",
      ctaVariant: "outlined" as const,
    },
    {
      id: "pro",
      name: "Professional",
      icon: <BoltIcon />,
      color: theme.palette.primary.main,
      price: isAnnual ? "49" : "59",
      period: isAnnual ? "/month" : "/month",
      description: "Everything you need to launch successfully",
      features: [
        "Everything in Starter +",
        "Unlimited Business Ideas",
        "Advanced AI Insights",
        "Competitor Analysis",
        "Financial Modeling",
        "Investor-Ready Documents",
        "Priority Support",
        "Custom Branding",
      ],
      popular: true,
      cta: "Get Started",
      ctaVariant: "contained" as const,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      icon: <TrendingUpIcon />,
      color: theme.palette.success.main,
      price: "Custom",
      period: "",
      description: "For growing businesses and teams",
      features: [
        "Everything in Professional +",
        "Team Collaboration",
        "API Access",
        "Custom AI Models",
        "Dedicated Account Manager",
        "White-label Solution",
        "SLA Guarantee",
        "Onboarding & Training",
      ],
      cta: "Contact Sales",
      ctaVariant: "outlined" as const,
    },
  ];

  const features = [
    {
      icon: <AutoAwesomeIcon />,
      title: "AI-Powered Insights",
      description:
        "Get intelligent recommendations powered by advanced machine learning algorithms.",
    },
    {
      icon: <QueryStatsIcon />,
      title: "Data-Driven Analysis",
      description: "Make informed decisions with comprehensive market and financial analysis.",
    },
    {
      icon: <SecurityIcon />,
      title: "Secure & Private",
      description: "Your business ideas and data are protected with enterprise-grade security.",
    },
    {
      icon: <SupportIcon />,
      title: "Expert Support",
      description: "Access to business experts and AI specialists when you need guidance.",
    },
    {
      icon: <PremiumIcon />,
      title: "Premium Tools",
      description: "Access exclusive tools for market research and investor pitch preparation.",
    },
  ];

  const faqs = [
    {
      question: "Can I change plans anytime?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! All paid plans include a 14-day free trial with full access to all features.",
    },
    {
      question: "How secure is my business data?",
      answer:
        "We use enterprise-grade encryption and comply with industry security standards. Your data is never shared.",
    },
    {
      question: "Can I cancel my subscription?",
      answer:
        "You can cancel anytime. No hidden fees or contracts. Cancel through your account settings.",
    },
  ];

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              mb: 3,
              position: "relative",
            }}
          >
            Transform Your Business Vision
            <br />
            <Box component="span" sx={{ color: theme.palette.warning.light }}>
              with AI Power
            </Box>
          </Typography>
          <Typography
            variant="h5"
            sx={{
              maxWidth: "700px",
              margin: "0 auto",
              mb: 6,
              opacity: 0.9,
              fontWeight: 400,
            }}
          >
            Join thousands of entrepreneurs who have turned their ideas into successful businesses
            with our AI-powered platform.
          </Typography>

          {/* Toggle Switch */}
          <Paper
            sx={{
              display: "inline-flex",
              alignItems: "center",
              p: 1,
              borderRadius: "50px",
              bgcolor: alpha(theme.palette.common.white, 0.1),
              backdropFilter: "blur(10px)",
            }}
          >
            <Typography sx={{ color: !isAnnual ? "white" : "rgba(255,255,255,0.7)", px: 2 }}>
              Monthly
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={isAnnual}
                  onChange={(e) => setIsAnnual(e.target.checked)}
                  color="warning"
                />
              }
              label=""
            />
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ color: isAnnual ? "white" : "rgba(255,255,255,0.7)", px: 2 }}>
                Annual
              </Typography>
              <Chip
                label="Save 20%"
                size="small"
                sx={{
                  bgcolor: theme.palette.success.main,
                  color: "white",
                  fontWeight: 700,
                }}
              />
            </Box>
          </Paper>
        </Container>
      </HeroSection>

      {/* Pricing Cards Section */}
      <Container maxWidth="lg" sx={{ py: 12, position: "relative", top: "-60px" }}>
        <PricingGrid>
          {plans.map((plan) => (
            <Box key={plan.id}>
              <PricingCard
                sx={{
                  borderColor: selectedPlan === plan.id ? plan.color : undefined,
                  ...(plan.popular && {
                    boxShadow: `0 0 0 1px ${plan.color}`,
                  }),
                }}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && <PopularBadge>MOST POPULAR</PopularBadge>}
                <CardContent sx={{ flexGrow: 1, p: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: "14px",
                        bgcolor: alpha(plan.color, 0.1),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 2,
                      }}
                    >
                      <Box sx={{ color: plan.color, fontSize: "2rem" }}>{plan.icon}</Box>
                    </Box>
                    <Box>
                      <Typography variant="h5" fontWeight={700}>
                        {plan.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {plan.description}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ my: 4 }}>
                    <Typography variant="h2" fontWeight={800} sx={{ color: plan.color }}>
                      ${plan.price}
                      {plan.period && (
                        <Typography component="span" variant="h6" color="text.secondary">
                          {plan.period}
                        </Typography>
                      )}
                    </Typography>
                    {plan.id !== "enterprise" && (
                      <Typography variant="body2" color="text.secondary">
                        {isAnnual ? "billed annually" : "billed monthly"}
                      </Typography>
                    )}
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <FeatureList>
                    {plan.features.map((feature, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              bgcolor: alpha(plan.color, 0.1),
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <CheckIcon sx={{ fontSize: 16, color: plan.color }} />
                          </Box>
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </FeatureList>
                </CardContent>
                <CardActions sx={{ p: 4, pt: 0 }}>
                  <Button
                    fullWidth
                    variant={plan.ctaVariant}
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      borderRadius: "12px",
                      py: 2,
                      ...(plan.ctaVariant === "contained" && {
                        bgcolor: plan.color,
                        "&:hover": {
                          bgcolor: plan.color,
                          transform: "translateY(-2px)",
                          boxShadow: `0 8px 24px ${alpha(plan.color, 0.4)}`,
                        },
                      }),
                      ...(plan.ctaVariant === "outlined" && {
                        borderColor: plan.color,
                        color: plan.color,
                        "&:hover": {
                          borderColor: plan.color,
                          bgcolor: alpha(plan.color, 0.05),
                        },
                      }),
                    }}
                  >
                    {plan.cta}
                  </Button>
                </CardActions>
              </PricingCard>
            </Box>
          ))}
        </PricingGrid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" fontWeight={800} sx={{ mb: 1 }}>
          Why Choose Our Platform
        </Typography>
        <Typography
          variant="h6"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 8, maxWidth: "700px", mx: "auto" }}
        >
          Everything you need to turn your business idea into reality
        </Typography>

        <FeaturesGrid>
          {features.map((feature, index) => (
            <Fade in timeout={800} style={{ transitionDelay: `${index * 100}ms` }} key={index}>
              <Paper
                sx={{
                  p: 4,
                  height: "100%",
                  textAlign: "center",
                  borderRadius: "16px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.1)}`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "16px",
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                  }}
                >
                  <Box sx={{ color: theme.palette.primary.main, fontSize: "2rem" }}>
                    {feature.icon}
                  </Box>
                </Box>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Fade>
          ))}
        </FeaturesGrid>
      </Container>

      {/* FAQ Section */}
      <Container maxWidth="md" sx={{ py: 12 }}>
        <Typography variant="h3" textAlign="center" fontWeight={800} sx={{ mb: 1 }}>
          Frequently Asked Questions
        </Typography>
        <Typography
          variant="h6"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 8, maxWidth: "600px", mx: "auto" }}
        >
          Get answers to common questions about our platform
        </Typography>

        <FAQGrid>
          {faqs.map((faq, index) => (
            <Box key={index}>
              <Paper sx={{ p: 4, borderRadius: "16px", height: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                  <Tooltip title="Learn more">
                    <IconButton size="small" sx={{ mr: 2, mt: 0.5 }}>
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                  <Box>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                      {faq.question}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {faq.answer}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          ))}
        </FAQGrid>

        {/* CTA Section */}
        <Box
          sx={{
            mt: 12,
            textAlign: "center",
            p: 8,
            borderRadius: "24px",
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.1
            )} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Typography variant="h3" fontWeight={800} sx={{ mb: 2 }}>
            Ready to Transform Your Business?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: "600px", mx: "auto" }}
          >
            Join thousands of successful entrepreneurs who started with just an idea.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderRadius: "12px",
              px: 6,
              py: 2,
              fontSize: "1.1rem",
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
              },
            }}
          >
            Start Your Free Trial Today
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Subscription;
