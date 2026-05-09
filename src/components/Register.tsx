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
   const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: (e.clientX - rect.left) / rect.width * 2 - 1,
      y: (e.clientY - rect.top) / rect.height * 2 - 1,
    });
  };

  const spring = "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)";

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
         onMouseMove={handleMouseMove}
        onMouseLeave={() => setMouse({ x: 0, y: 0 })}
      >
        <Box position="absolute" top="-80px" right="-80px" w="360px" h="360px" borderRadius="full" bg="rgba(139,92,246,0.18)" filter="blur(80px)" />
        <Box position="absolute" bottom="-60px" left="-60px" w="280px" h="280px" borderRadius="full" bg="rgba(245,158,11,0.1)" filter="blur(70px)" />

        <HStack spacing={3} position="relative" zIndex={1}>
          <Image src={logo} h="32px" w="32px" alt="eventlight icon" />
          <Text fontWeight="800" fontSize="xl" letterSpacing="-0.04em" color="white">
            event<Box as="span" color="#A78BFA">light</Box>
          </Text>
        </HStack>

        {/* Interactive parallax illustration */}
        <Box position="relative" zIndex={1} display="flex" justifyContent="center" alignItems="center">
          <svg width="290" height="280" viewBox="0 0 290 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>

            {/* Glow — drifts toward cursor */}
            <g style={{ transform: `translate(${mouse.x * 22}px, ${mouse.y * 16}px)`, transition: spring }}>
              <circle cx="145" cy="140" r="118" fill="url(#radialGlowL)" opacity="0.7"/>
            </g>

            {/* Card stack — subtle 3D tilt */}
            <g style={{
              transform: `perspective(900px) rotateX(${mouse.y * -7}deg) rotateY(${mouse.x * 9}deg) translate(${mouse.x * -6}px, ${mouse.y * -5}px)`,
              transition: spring,
              transformOrigin: "145px 126px",
            }}>
              {/* Back card */}
              <g transform="rotate(-8 145 126)">
                <rect x="46" y="60" width="196" height="136" rx="20" fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.07)" strokeWidth="1.2"/>
              </g>
              {/* Mid card */}
              <g transform="rotate(-3 145 126)">
                <rect x="44" y="58" width="200" height="138" rx="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.2"/>
              </g>
              {/* Front card */}
              <rect x="41" y="54" width="206" height="144" rx="20" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
              {/* Hero image area */}
              <rect x="51" y="64" width="186" height="88" rx="14" fill="rgba(109,40,217,0.4)"/>
              <rect x="51" y="64" width="186" height="88" rx="14" fill="url(#heroGradientL)"/>
              {/* Wave */}
              <path d="M51 128 Q 95 108 145 122 Q 195 138 237 114 L237 152 Q 195 152 145 152 Q 95 152 51 152 Z" fill="rgba(109,40,217,0.28)"/>
              {/* Avatar bubbles */}
              <circle cx="82"  cy="99" r="17" fill="rgba(167,139,250,0.25)" stroke="rgba(167,139,250,0.4)" strokeWidth="1.5"/>
              <circle cx="108" cy="99" r="17" fill="rgba(124,58,237,0.38)"  stroke="rgba(124,58,237,0.55)"  strokeWidth="1.5"/>
              <circle cx="134" cy="99" r="17" fill="rgba(167,139,250,0.25)" stroke="rgba(167,139,250,0.4)" strokeWidth="1.5"/>
              <rect x="149" y="84" width="36" height="22" rx="11" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
              <rect x="157" y="92" width="20" height="6" rx="3" fill="rgba(255,255,255,0.5)"/>
              {/* Text rows */}
              <rect x="51" y="162" width="126" height="8" rx="4" fill="rgba(255,255,255,0.55)"/>
              <rect x="51" y="177" width="86"  height="6" rx="3" fill="rgba(255,255,255,0.22)"/>
              {/* Free badge */}
              <rect x="174" y="159" width="56" height="22" rx="11" fill="rgba(16,185,129,0.15)" stroke="rgba(52,211,153,0.35)" strokeWidth="1"/>
              <rect x="185" y="167" width="34" height="6" rx="3" fill="rgba(52,211,153,0.6)"/>
            </g>

            {/* Calendar — top-left, drifts away from card */}
            <g style={{ transform: `translate(${mouse.x * -18}px, ${mouse.y * -14}px)`, transition: spring }}>
              <circle cx="42" cy="36" r="24" fill="rgba(167,139,250,0.12)" stroke="rgba(167,139,250,0.28)" strokeWidth="1.5"/>
              <rect x="30" y="25" width="24" height="20" rx="4" fill="none" stroke="rgba(167,139,250,0.8)" strokeWidth="1.5"/>
              <line x1="30" y1="32" x2="54" y2="32" stroke="rgba(167,139,250,0.8)" strokeWidth="1.5"/>
              <line x1="37" y1="22" x2="37" y2="27" stroke="rgba(167,139,250,0.8)" strokeWidth="2" strokeLinecap="round"/>
              <line x1="47" y1="22" x2="47" y2="27" stroke="rgba(167,139,250,0.8)" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="37" cy="38" r="2.2" fill="rgba(167,139,250,0.65)"/>
              <circle cx="42" cy="38" r="2.2" fill="rgba(167,139,250,0.65)"/>
              <circle cx="47" cy="38" r="2.2" fill="rgba(167,139,250,0.65)"/>
            </g>

            {/* Location pin — top-right */}
            <g style={{ transform: `translate(${mouse.x * 20}px, ${mouse.y * -16}px)`, transition: spring }}>
              <circle cx="248" cy="34" r="24" fill="rgba(245,158,11,0.12)" stroke="rgba(245,158,11,0.28)" strokeWidth="1.5"/>
              <path d="M248 21 C241 21 234 27 234 34 C234 43 248 52 248 52 C248 52 262 43 262 34 C262 27 255 21 248 21 Z" fill="rgba(245,158,11,0.82)"/>
              <circle cx="248" cy="34" r="5" fill="rgba(30,27,75,0.55)"/>
            </g>

            {/* Bell — bottom-right */}
            <g style={{ transform: `translate(${mouse.x * 16}px, ${mouse.y * 18}px)`, transition: spring }}>
              <circle cx="246" cy="210" r="22" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5"/>
              <path d="M246 200 C239 200 234 205 234 210 C234 214 234 216 232 217 L260 217 C258 216 258 214 258 210 C258 205 253 200 246 200 Z" fill="rgba(255,255,255,0.42)"/>
              <path d="M242 217 Q242 221 250 221 Q258 221 250 217" stroke="rgba(255,255,255,0.42)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              <circle cx="246" cy="198" r="3" fill="rgba(245,158,11,0.88)"/>
            </g>

            {/* Star — bottom-left */}
            <g style={{ transform: `translate(${mouse.x * -14}px, ${mouse.y * 16}px)`, transition: spring }}>
              <circle cx="40" cy="212" r="22" fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.24)" strokeWidth="1.5"/>
              <path d="M40 199 L42.9 207.9 L52.4 207.9 L45 213.3 L47.5 222.2 L40 216.8 L32.5 222.2 L35 213.3 L27.6 207.9 L37.1 207.9 Z" fill="rgba(245,158,11,0.65)"/>
            </g>

            {/* Ambient dots — very slow drift */}
            <g style={{ transform: `translate(${mouse.x * -5}px, ${mouse.y * -4}px)`, transition: spring }}>
              <circle cx="145" cy="20"  r="2.8" fill="rgba(255,255,255,0.22)"/>
              <circle cx="164" cy="12"  r="1.8" fill="rgba(255,255,255,0.12)"/>
              <circle cx="126" cy="14"  r="1.8" fill="rgba(255,255,255,0.12)"/>
              <circle cx="278" cy="128" r="2"   fill="rgba(255,255,255,0.16)"/>
              <circle cx="285" cy="146" r="1.4" fill="rgba(255,255,255,0.1)"/>
              <circle cx="10"  cy="130" r="2"   fill="rgba(255,255,255,0.16)"/>
              <circle cx="4"   cy="148" r="1.4" fill="rgba(255,255,255,0.1)"/>
              <circle cx="106" cy="258" r="2.2" fill="rgba(255,255,255,0.18)"/>
              <circle cx="186" cy="263" r="2.8" fill="rgba(255,255,255,0.14)"/>
              <circle cx="218" cy="252" r="1.6" fill="rgba(255,255,255,0.1)"/>
            </g>

            <defs>
              <radialGradient id="radialGlowL" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="rgba(139,92,246,0.38)"/>
                <stop offset="100%" stopColor="rgba(139,92,246,0)"/>
              </radialGradient>
              <linearGradient id="heroGradientL" x1="145" y1="64" x2="145" y2="152" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor="rgba(0,0,0,0)"/>
                <stop offset="100%" stopColor="rgba(0,0,0,0.45)"/>
              </linearGradient>
            </defs>
          </svg>
        </Box>

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
