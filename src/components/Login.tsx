import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  HStack,
  IconButton,
  InputGroup,
  InputRightElement,
  Alert,
  AlertIcon,
  Link as ChakraLink,
  Image,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo.svg";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const panelBg = useColorModeValue("white", "gray.900");
  const inputBg = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const labelColor = useColorModeValue("gray.700", "gray.300");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formErrors.length > 0) setFormErrors([]);
  };

  const validate = (): boolean => {
    const errors: string[] = [];
    if (!formData.email) errors.push("Email is required");
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.push("Enter a valid email address");
    if (!formData.password) errors.push("Password is required");
    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const success = await login(formData);
    if (success) {
      const from = (location.state as any)?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  };

  return (
    <Flex minH="100vh">
      {/* Left panel — brand / decorative (desktop only) */}
      <Box
        display={{ base: "none", lg: "flex" }}
        flex="1"
        flexDirection="column"
        bgGradient="linear(135deg, #1E1B4B 0%, #2D1B69 40%, #4C1D95 100%)"
        position="relative"
        overflow="hidden"
        p={12}
        justifyContent="space-between"
      >
        {/* Decorative orbs */}
        <Box position="absolute" top="-60px" right="-60px" w="320px" h="320px" borderRadius="full" bg="rgba(139,92,246,0.2)" filter="blur(80px)" />
        <Box position="absolute" bottom="-40px" left="-40px" w="240px" h="240px" borderRadius="full" bg="rgba(245,158,11,0.12)" filter="blur(60px)" />

        {/* Logo */}
        <HStack spacing={3} position="relative" zIndex={1}>
          <Image src={logo} h="32px" w="32px" alt="eventlight icon" />
          <Text fontWeight="800" fontSize="xl" letterSpacing="-0.04em" color="white">
            event<Box as="span" color="#A78BFA">light</Box>
          </Text>
        </HStack>

        {/* Copy */}
        <VStack align="start" spacing={5} position="relative" zIndex={1}>
          <VStack align="start" spacing={2}>
            <Text
              fontSize="3xl"
              fontWeight="800"
              letterSpacing="-0.04em"
              color="white"
              lineHeight="1.15"
            >
              Your next great<br />experience awaits.
            </Text>
            <Text color="rgba(196,181,253,0.8)" fontSize="md" lineHeight="1.6" maxW="340px">
              Thousands of events happening near you — concerts, workshops, meetups, and more.
            </Text>
          </VStack>

          {/* Stats */}
          <HStack spacing={8} pt={2}>
            {[
              { n: "10K+", l: "Events" },
              { n: "500+", l: "Cities" },
            ].map(({ n, l }) => (
              <VStack key={l} align="start" spacing={0}>
                <Text fontWeight="800" fontSize="2xl" color="white" letterSpacing="-0.04em">{n}</Text>
                <Text fontSize="xs" color="rgba(196,181,253,0.65)" textTransform="uppercase" letterSpacing="0.08em">{l}</Text>
              </VStack>
            ))}
          </HStack>
        </VStack>
      </Box>

      {/* Right panel — form */}
      <Flex
        flex={{ base: 1, lg: "0 0 480px" }}
        bg={panelBg}
        flexDirection="column"
        justifyContent="center"
        px={{ base: 6, sm: 10, lg: 14 }}
        py={12}
        position="relative"
      >
        {/* Back button */}
        <Box position="absolute" top={6} left={6}>
          <Link to="/">
            <IconButton
              aria-label="Back to home"
              icon={<FiArrowLeft />}
              variant="ghost"
              borderRadius="full"
              size="sm"
              color={mutedColor}
              _hover={{ bg: useColorModeValue("gray.100", "gray.800") }}
            />
          </Link>
        </Box>

        {/* Mobile logo */}
        <HStack spacing={2.5} mb={10} display={{ base: "flex", lg: "none" }}>
          <Image src={logo} h="28px" w="28px" alt="eventlight icon" />
          <Text fontWeight="800" fontSize="lg" letterSpacing="-0.04em" color={useColorModeValue("gray.900", "white")}>
            event<Box as="span" color="brand.600">light</Box>
          </Text>
        </HStack>

        <VStack align="stretch" spacing={8} maxW="380px" w="full" mx="auto">
          {/* Header */}
          <VStack align="start" spacing={1}>
            <Heading size="lg" letterSpacing="-0.03em">Welcome back</Heading>
            <Text color={mutedColor} fontSize="sm">
              Sign in to your account to continue
            </Text>
          </VStack>

          {/* Errors */}
          {formErrors.length > 0 && (
            <Alert status="error" borderRadius="xl" fontSize="sm">
              <AlertIcon />
              <VStack align="start" spacing={0.5}>
                {formErrors.map((e, i) => <Text key={i}>{e}</Text>)}
              </VStack>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" color={labelColor}>
                  Email address
                </FormLabel>
                <InputGroup>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    bg={inputBg}
                    border="1.5px solid"
                    borderColor={borderColor}
                    borderRadius="xl"
                    h="46px"
                    fontSize="sm"
                    _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 3px rgba(139,92,246,0.15)", bg: panelBg }}
                    _hover={{ borderColor: "brand.300" }}
                  />
                </InputGroup>
              </FormControl>

              <FormControl>
                <Flex justify="space-between" align="center" mb={1.5}>
                  <FormLabel fontSize="sm" fontWeight="600" color={labelColor} mb={0}>
                    Password
                  </FormLabel>
                  <ChakraLink
                    as={Link}
                    to="/auth/forgot-password"
                    fontSize="xs"
                    color="brand.500"
                    fontWeight="600"
                    _hover={{ color: "brand.700" }}
                  >
                    Forgot password?
                  </ChakraLink>
                </Flex>
                <InputGroup>
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Your password"
                    bg={inputBg}
                    border="1.5px solid"
                    borderColor={borderColor}
                    borderRadius="xl"
                    h="46px"
                    fontSize="sm"
                    pr="3rem"
                    _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 3px rgba(139,92,246,0.15)", bg: panelBg }}
                    _hover={{ borderColor: "brand.300" }}
                  />
                  <InputRightElement h="46px">
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      icon={showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                      variant="ghost"
                      size="sm"
                      borderRadius="full"
                      color={mutedColor}
                      onClick={() => setShowPassword((s) => !s)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                variant="brand"
                size="lg"
                w="full"
                borderRadius="xl"
                h="46px"
                fontSize="sm"
                isLoading={loading}
                loadingText="Signing in…"
                mt={1}
              >
                Sign in
              </Button>
            </VStack>
          </form>

          <Text textAlign="center" fontSize="sm" color={mutedColor}>
            Don't have an account?{" "}
            <ChakraLink
              as={Link}
              to="/auth/register"
              color="brand.600"
              fontWeight="700"
              _hover={{ color: "brand.700" }}
            >
              Create one free
            </ChakraLink>
          </Text>
        </VStack>
      </Flex>
    </Flex>
  );
};

export default Login;
