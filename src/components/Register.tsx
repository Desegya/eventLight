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
  SimpleGrid,
} from "@chakra-ui/react";
import {
  BiArrowBack,
  BiUser,
  BiLock,
  BiShow,
  BiHide,
  BiEnvelope,
  BiGroup,
} from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (!formData.first_name.trim()) {
      errors.push("First name is required");
    }

    if (!formData.last_name.trim()) {
      errors.push("Last name is required");
    }

    if (!formData.username.trim()) {
      errors.push("Username is required");
    } else if (formData.username.length < 3) {
      errors.push("Username must be at least 3 characters");
    }

    if (!formData.email) {
      errors.push("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push("Please enter a valid email address");
    }

    if (!formData.password) {
      errors.push("Password is required");
    } else if (formData.password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }

    if (formData.password !== formData.confirmPassword) {
      errors.push("Passwords do not match");
    }

    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const { confirmPassword, ...registerData } = formData;
    const success = await register(registerData);

    if (success) {
      navigate("/", { replace: true });
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
        maxW="500px"
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
            Create Account
          </Heading>
          <Text color="gray.600" textAlign="center">
            Join our community and start discovering events
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
            {/* Name Fields */}
            <SimpleGrid columns={2} spacing={4} w="full">
              <FormControl>
                <FormLabel>
                  <HStack>
                    <BiUser />
                    <Text>First Name</Text>
                  </HStack>
                </FormLabel>
                <Input
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First name"
                  size="lg"
                />
              </FormControl>

              <FormControl>
                <FormLabel>
                  <HStack>
                    <BiUser />
                    <Text>Last Name</Text>
                  </HStack>
                </FormLabel>
                <Input
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Last name"
                  size="lg"
                />
              </FormControl>
            </SimpleGrid>

            {/* Username */}
            <FormControl>
              <FormLabel>
                <HStack>
                  <BiGroup />
                  <Text>Username</Text>
                </HStack>
              </FormLabel>
              <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                size="lg"
              />
            </FormControl>

            {/* Email */}
            <FormControl>
              <FormLabel>
                <HStack>
                  <BiEnvelope />
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
                  placeholder="Create a password"
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

            {/* Confirm Password */}
            <FormControl>
              <FormLabel>
                <HStack>
                  <BiLock />
                  <Text>Confirm Password</Text>
                </HStack>
              </FormLabel>
              <Box position="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  size="lg"
                  pr="3rem"
                />
                <IconButton
                  icon={showConfirmPassword ? <BiHide /> : <BiShow />}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  variant="ghost"
                  size="sm"
                  position="absolute"
                  right="0.5rem"
                  top="50%"
                  transform="translateY(-50%)"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                />
              </Box>
            </FormControl>

            {/* Submit Button */}
            <Button
              type="submit"
              bg="blue.800"
              color="white"
              size="lg"
              w="full"
              isLoading={loading}
              loadingText="Creating Account..."
              _hover={{ bg: "blue.700" }}
            >
              Create Account
            </Button>
          </VStack>
        </form>

        {/* Divider */}
        <Box my={8}>
          <Divider />
        </Box>

        {/* Sign In Link */}
        <VStack spacing={4}>
          <Text textAlign="center" color="gray.600">
            Already have an account?{" "}
            <ChakraLink
              as={Link}
              to="/auth/login"
              color="blue.500"
              fontWeight="semibold"
              _hover={{ textDecoration: "underline" }}
            >
              Sign In
            </ChakraLink>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default Register;
