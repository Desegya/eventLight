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
  SimpleGrid,
} from "@chakra-ui/react";
import { FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo.svg";

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
  const [showConfirm, setShowConfirm] = useState(false);
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
    if (!formData.first_name.trim()) errors.push("First name is required");
    if (!formData.last_name.trim()) errors.push("Last name is required");
    if (!formData.username.trim()) errors.push("Username is required");
    else if (formData.username.length < 3) errors.push("Username must be at least 3 characters");
    if (!formData.email) errors.push("Email is required");
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.push("Enter a valid email address");
    if (!formData.password) errors.push("Password is required");
    else if (formData.password.length < 8) errors.push("Password must be at least 8 characters");
    if (formData.password !== formData.confirmPassword) errors.push("Passwords do not match");
    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const { confirmPassword, ...registerData } = formData;
    const success = await register(registerData);
    if (success) navigate("/", { replace: true });
  };

  const inputProps = {
    bg: inputBg,
    border: "1.5px solid",
    borderColor,
    borderRadius: "xl",
    h: "44px",
    fontSize: "sm",
    _focus: { borderColor: "brand.500", boxShadow: "0 0 0 3px rgba(139,92,246,0.15)", bg: panelBg },
    _hover: { borderColor: "brand.300" },
  };

  return (
    <Flex minH="100vh">
      {/* Left decorative panel */}
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
        <Box position="absolute" top="-80px" right="-80px" w="360px" h="360px" borderRadius="full" bg="rgba(139,92,246,0.18)" filter="blur(80px)" />
        <Box position="absolute" bottom="-60px" left="-60px" w="280px" h="280px" borderRadius="full" bg="rgba(245,158,11,0.1)" filter="blur(70px)" />

        <HStack spacing={3} position="relative" zIndex={1}>
          <Image src={logo} h="32px" w="32px" alt="eventlight icon" />
          <Text fontWeight="800" fontSize="xl" letterSpacing="-0.04em" color="white">
            event<Box as="span" color="#A78BFA">light</Box>
          </Text>
        </HStack>

        <VStack align="start" spacing={5} position="relative" zIndex={1}>
          <VStack align="start" spacing={2}>
            <Text fontSize="3xl" fontWeight="800" letterSpacing="-0.04em" color="white" lineHeight="1.15">
              Join thousands of<br />event explorers.
            </Text>
            <Text color="rgba(196,181,253,0.8)" fontSize="md" lineHeight="1.6" maxW="340px">
              Discover, save, and attend events that match your passions — all in one beautifully designed platform.
            </Text>
          </VStack>
          <HStack spacing={8} pt={2}>
            {[
              { n: "2M+", l: "Members" },
              { n: "10K+", l: "Events" },
            ].map(({ n, l }) => (
              <VStack key={l} align="start" spacing={0}>
                <Text fontWeight="800" fontSize="2xl" color="white" letterSpacing="-0.04em">{n}</Text>
                <Text fontSize="xs" color="rgba(196,181,253,0.65)" textTransform="uppercase" letterSpacing="0.08em">{l}</Text>
              </VStack>
            ))}
          </HStack>
        </VStack>
      </Box>

      {/* Right form panel */}
      <Flex
        flex={{ base: 1, lg: "0 0 520px" }}
        bg={panelBg}
        flexDirection="column"
        justifyContent="center"
        px={{ base: 6, sm: 10, lg: 12 }}
        py={12}
        overflowY="auto"
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
        <HStack spacing={2.5} mb={8} display={{ base: "flex", lg: "none" }}>
          <Image src={logo} h="28px" w="28px" alt="eventlight icon" />
          <Text fontWeight="800" fontSize="lg" letterSpacing="-0.04em" color={useColorModeValue("gray.900", "white")}>
            event<Box as="span" color="brand.600">light</Box>
          </Text>
        </HStack>

        <VStack align="stretch" spacing={7} maxW="420px" w="full" mx="auto">
          <VStack align="start" spacing={1}>
            <Heading size="lg" letterSpacing="-0.03em">Create your account</Heading>
            <Text color={mutedColor} fontSize="sm">
              Join the community and start discovering events.
            </Text>
          </VStack>

          {formErrors.length > 0 && (
            <Alert status="error" borderRadius="xl" fontSize="sm">
              <AlertIcon />
              <VStack align="start" spacing={0.5}>
                {formErrors.map((e, i) => <Text key={i}>{e}</Text>)}
              </VStack>
            </Alert>
          )}

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <VStack spacing={4}>
              {/* Name row */}
              <SimpleGrid columns={2} spacing={3} w="full">
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="600" color={labelColor}>First name</FormLabel>
                  <Input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="John" {...inputProps} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="600" color={labelColor}>Last name</FormLabel>
                  <Input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Doe" {...inputProps} />
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" color={labelColor}>Username</FormLabel>
                <Input name="username" value={formData.username} onChange={handleChange} placeholder="johndoe" {...inputProps} />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" color={labelColor}>Email address</FormLabel>
                <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" {...inputProps} />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" color={labelColor}>Password</FormLabel>
                <InputGroup>
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 8 characters"
                    {...inputProps}
                    pr="3rem"
                  />
                  <InputRightElement h="44px">
                    <IconButton
                      aria-label={showPassword ? "Hide" : "Show"}
                      icon={showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                      variant="ghost" size="sm" borderRadius="full" color={mutedColor}
                      onClick={() => setShowPassword((s) => !s)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" color={labelColor}>Confirm password</FormLabel>
                <InputGroup>
                  <Input
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    {...inputProps}
                    pr="3rem"
                  />
                  <InputRightElement h="44px">
                    <IconButton
                      aria-label={showConfirm ? "Hide" : "Show"}
                      icon={showConfirm ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                      variant="ghost" size="sm" borderRadius="full" color={mutedColor}
                      onClick={() => setShowConfirm((s) => !s)}
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
                loadingText="Creating account…"
                mt={1}
              >
                Create account
              </Button>

              <Text fontSize="xs" color={mutedColor} textAlign="center" lineHeight="1.5">
                By creating an account, you agree to our{" "}
                <ChakraLink color="brand.500" fontWeight="600">Terms of Service</ChakraLink>{" "}
                and{" "}
                <ChakraLink color="brand.500" fontWeight="600">Privacy Policy</ChakraLink>.
              </Text>
            </VStack>
          </form>

          <Text textAlign="center" fontSize="sm" color={mutedColor}>
            Already have an account?{" "}
            <ChakraLink
              as={Link}
              to="/auth/login"
              color="brand.600"
              fontWeight="700"
              _hover={{ color: "brand.700" }}
            >
              Sign in
            </ChakraLink>
          </Text>
        </VStack>
      </Flex>
    </Flex>
  );
};

export default Register;
