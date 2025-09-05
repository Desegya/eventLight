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
  Alert,
  AlertIcon,
  Link as ChakraLink,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { BiArrowBack, BiUser, BiLock, BiShow, BiHide } from "react-icons/bi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear errors when user starts typing
    if (formErrors.length > 0) {
      setFormErrors([]);
    }
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.email) {
      errors.push("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push("Please enter a valid email address");
    }

    if (!formData.password) {
      errors.push("Password is required");
    }

    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const success = await login(formData);

    if (success) {
      // Redirect to intended page or home
      const from = (location.state as any)?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
      bg={useColorModeValue("gray.50", "gray.900")}
    >
      <Box
        maxW="400px"
        w="full"
        bg={bgColor}
        rounded="lg"
        boxShadow="lg"
        p={8}
        border="1px"
        borderColor={borderColor}
      >
        {/* Back Button */}
        <Box mb={6}>
          <Link to="/">
            <IconButton
              icon={<BiArrowBack />}
              aria-label="Back to homepage"
              variant="ghost"
              size="lg"
            />
          </Link>
        </Box>

        {/* Header */}
        <VStack spacing={4} mb={8}>
          <Heading as="h1" size="xl" textAlign="center">
            Welcome Back
          </Heading>
          <Text color="gray.600" textAlign="center">
            Sign in to your account to continue
          </Text>
        </VStack>

        {/* Error Alert */}
        {formErrors.length > 0 && (
          <Alert status="error" mb={4} rounded="md">
            <AlertIcon />
            <VStack align="start" spacing={1}>
              {formErrors.map((error, index) => (
                <Text key={index} fontSize="sm">
                  {error}
                </Text>
              ))}
            </VStack>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <VStack spacing={6}>
            {/* Email */}
            <FormControl>
              <FormLabel>
                <HStack>
                  <BiUser />
                  <Text>Email Address</Text>
                </HStack>
              </FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                size="lg"
              />
            </FormControl>

            {/* Password */}
            <FormControl>
              <FormLabel>
                <HStack>
                  <BiLock />
                  <Text>Password</Text>
                </HStack>
              </FormLabel>
              <Box position="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  size="lg"
                  pr="3rem"
                />
                <IconButton
                  icon={showPassword ? <BiHide /> : <BiShow />}
                  onClick={() => setShowPassword(!showPassword)}
                  variant="ghost"
                  size="sm"
                  position="absolute"
                  right="0.5rem"
                  top="50%"
                  transform="translateY(-50%)"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                />
              </Box>
            </FormControl>

            {/* Forgot Password Link */}
            <Box w="full" textAlign="right">
              <ChakraLink
                as={Link}
                to="/auth/forgot-password"
                color="blue.500"
                fontSize="sm"
                _hover={{ textDecoration: "underline" }}
              >
                Forgot your password?
              </ChakraLink>
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              bg="blue.800"
              color="white"
              size="lg"
              w="full"
              isLoading={loading}
              loadingText="Signing In..."
              _hover={{ bg: "blue.700" }}
            >
              Sign In
            </Button>
          </VStack>
        </form>

        {/* Divider */}
        <Box my={8}>
          <Divider />
        </Box>

        {/* Sign Up Link */}
        <VStack spacing={4}>
          <Text textAlign="center" color="gray.600">
            Don't have an account?{" "}
            <ChakraLink
              as={Link}
              to="/auth/register"
              color="blue.500"
              fontWeight="semibold"
              _hover={{ textDecoration: "underline" }}
            >
              Create Account
            </ChakraLink>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default Login;
