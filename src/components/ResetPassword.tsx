import { useState, useEffect } from "react";
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
  Icon,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { FiArrowLeft, FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { authService, AuthError } from "../services/auth";
import logo from "../assets/logo.svg";

const ResetPassword = () => {
  const navigate = useNavigate();

  const token = new URLSearchParams(window.location.search).get("token") ?? "";

  const [formData, setFormData] = useState({ new_password1: "", new_password2: "" });
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => navigate("/auth/login", { replace: true }), 3000);
      return () => clearTimeout(t);
    }
  }, [success, navigate]);

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
    if (errors.length > 0) setErrors([]);
  };

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!formData.new_password1) errs.push("Password is required");
    else if (formData.new_password1.length < 8) errs.push("Password must be at least 8 characters");
    if (!formData.new_password2) errs.push("Please confirm your password");
    else if (formData.new_password1 !== formData.new_password2) errs.push("Passwords do not match");
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await authService.confirmPasswordReset({ token, ...formData });
      setSuccess(true);
    } catch (err) {
      if (err instanceof AuthError && err.errors) {
        const collected: string[] = [];
        if (err.errors.token) collected.push(...(Array.isArray(err.errors.token) ? err.errors.token : [err.errors.token]));
        if (err.errors.new_password1) collected.push(...(Array.isArray(err.errors.new_password1) ? err.errors.new_password1 : [err.errors.new_password1]));
        if (err.errors.new_password2) collected.push(...(Array.isArray(err.errors.new_password2) ? err.errors.new_password2 : [err.errors.new_password2]));
        setErrors(collected.length > 0 ? collected : ["Something went wrong. Please try again."]);
      } else {
        setErrors(["Something went wrong. Please try again."]);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputProps = {
    bg: inputBg,
    border: "1.5px solid" as const,
    borderColor,
    borderRadius: "xl",
    h: "46px",
    fontSize: "sm",
    _focus: { borderColor: "brand.500", boxShadow: "0 0 0 3px rgba(139,92,246,0.15)", bg: panelBg },
    _hover: { borderColor: "brand.300" },
  };

  const isTokenError = errors.some((e) =>
    e.toLowerCase().includes("invalid") || e.toLowerCase().includes("expired")
  );

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
        <Box position="absolute" top="-60px" right="-60px" w="320px" h="320px" borderRadius="full" bg="rgba(139,92,246,0.2)" filter="blur(80px)" />
        <Box position="absolute" bottom="-40px" left="-40px" w="240px" h="240px" borderRadius="full" bg="rgba(245,158,11,0.12)" filter="blur(60px)" />

        <HStack spacing={3} position="relative" zIndex={1}>
          <Image src={logo} h="32px" w="32px" alt="eventlight icon" />
          <Text fontWeight="800" fontSize="xl" letterSpacing="-0.04em" color="white">
            event<Box as="span" color="#A78BFA">light</Box>
          </Text>
        </HStack>

        <Box position="relative" zIndex={1} display="flex" justifyContent="center" alignItems="center">
          <svg width="290" height="280" viewBox="0 0 290 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
            <g style={{ transform: `translate(${mouse.x * 22}px, ${mouse.y * 16}px)`, transition: spring }}>
              <circle cx="145" cy="140" r="118" fill="url(#radialGlowRP)" opacity="0.7"/>
            </g>
            <g style={{
              transform: `perspective(900px) rotateX(${mouse.y * -7}deg) rotateY(${mouse.x * 9}deg) translate(${mouse.x * -6}px, ${mouse.y * -5}px)`,
              transition: spring,
              transformOrigin: "145px 126px",
            }}>
              <g transform="rotate(-8 145 126)">
                <rect x="46" y="60" width="196" height="136" rx="20" fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.07)" strokeWidth="1.2"/>
              </g>
              <g transform="rotate(-3 145 126)">
                <rect x="44" y="58" width="200" height="138" rx="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.2"/>
              </g>
              <rect x="41" y="54" width="206" height="144" rx="20" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
              <rect x="51" y="64" width="186" height="88" rx="14" fill="rgba(109,40,217,0.4)"/>
              <rect x="51" y="64" width="186" height="88" rx="14" fill="url(#heroGradientRP)"/>
              <path d="M51 128 Q 95 108 145 122 Q 195 138 237 114 L237 152 Q 195 152 145 152 Q 95 152 51 152 Z" fill="rgba(109,40,217,0.28)"/>
              <circle cx="82"  cy="99" r="17" fill="rgba(167,139,250,0.25)" stroke="rgba(167,139,250,0.4)" strokeWidth="1.5"/>
              <circle cx="108" cy="99" r="17" fill="rgba(124,58,237,0.38)"  stroke="rgba(124,58,237,0.55)"  strokeWidth="1.5"/>
              <circle cx="134" cy="99" r="17" fill="rgba(167,139,250,0.25)" stroke="rgba(167,139,250,0.4)" strokeWidth="1.5"/>
              <rect x="149" y="84" width="36" height="22" rx="11" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
              <rect x="157" y="92" width="20" height="6" rx="3" fill="rgba(255,255,255,0.5)"/>
              <rect x="51" y="162" width="126" height="8" rx="4" fill="rgba(255,255,255,0.55)"/>
              <rect x="51" y="177" width="86"  height="6" rx="3" fill="rgba(255,255,255,0.22)"/>
              <rect x="174" y="159" width="56" height="22" rx="11" fill="rgba(16,185,129,0.15)" stroke="rgba(52,211,153,0.35)" strokeWidth="1"/>
              <rect x="185" y="167" width="34" height="6" rx="3" fill="rgba(52,211,153,0.6)"/>
            </g>
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
            <g style={{ transform: `translate(${mouse.x * 20}px, ${mouse.y * -16}px)`, transition: spring }}>
              <circle cx="248" cy="34" r="24" fill="rgba(245,158,11,0.12)" stroke="rgba(245,158,11,0.28)" strokeWidth="1.5"/>
              <path d="M248 21 C241 21 234 27 234 34 C234 43 248 52 248 52 C248 52 262 43 262 34 C262 27 255 21 248 21 Z" fill="rgba(245,158,11,0.82)"/>
              <circle cx="248" cy="34" r="5" fill="rgba(30,27,75,0.55)"/>
            </g>
            <g style={{ transform: `translate(${mouse.x * 16}px, ${mouse.y * 18}px)`, transition: spring }}>
              <circle cx="246" cy="210" r="22" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5"/>
              <path d="M246 200 C239 200 234 205 234 210 C234 214 234 216 232 217 L260 217 C258 216 258 214 258 210 C258 205 253 200 246 200 Z" fill="rgba(255,255,255,0.42)"/>
              <path d="M242 217 Q242 221 250 221 Q258 221 250 217" stroke="rgba(255,255,255,0.42)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              <circle cx="246" cy="198" r="3" fill="rgba(245,158,11,0.88)"/>
            </g>
            <g style={{ transform: `translate(${mouse.x * -14}px, ${mouse.y * 16}px)`, transition: spring }}>
              <circle cx="40" cy="212" r="22" fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.24)" strokeWidth="1.5"/>
              <path d="M40 199 L42.9 207.9 L52.4 207.9 L45 213.3 L47.5 222.2 L40 216.8 L32.5 222.2 L35 213.3 L27.6 207.9 L37.1 207.9 Z" fill="rgba(245,158,11,0.65)"/>
            </g>
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
              <radialGradient id="radialGlowRP" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="rgba(139,92,246,0.38)"/>
                <stop offset="100%" stopColor="rgba(139,92,246,0)"/>
              </radialGradient>
              <linearGradient id="heroGradientRP" x1="145" y1="64" x2="145" y2="152" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor="rgba(0,0,0,0)"/>
                <stop offset="100%" stopColor="rgba(0,0,0,0.45)"/>
              </linearGradient>
            </defs>
          </svg>
        </Box>

        <VStack align="start" spacing={5} position="relative" zIndex={1}>
          <VStack align="start" spacing={2}>
            <Text fontSize="3xl" fontWeight="800" letterSpacing="-0.04em" color="white" lineHeight="1.15">
              Choose a strong<br />new password.
            </Text>
            <Text color="rgba(196,181,253,0.8)" fontSize="md" lineHeight="1.6" maxW="340px">
              At least 8 characters. Make it something you won't forget.
            </Text>
          </VStack>
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

      {/* Right form panel */}
      <Flex
        flex={{ base: 1, lg: "0 0 480px" }}
        bg={panelBg}
        flexDirection="column"
        justifyContent="center"
        px={{ base: 6, sm: 10, lg: 14 }}
        py={12}
        position="relative"
      >
        <Box position="absolute" top={6} left={6}>
          <Link to="/auth/login">
            <IconButton
              aria-label="Back to login"
              icon={<FiArrowLeft />}
              variant="ghost"
              borderRadius="full"
              size="sm"
              color={mutedColor}
              _hover={{ bg: useColorModeValue("gray.100", "gray.800") }}
            />
          </Link>
        </Box>

        <HStack spacing={2.5} mb={10} display={{ base: "flex", lg: "none" }}>
          <Image src={logo} h="28px" w="28px" alt="eventlight icon" />
          <Text fontWeight="800" fontSize="lg" letterSpacing="-0.04em" color={useColorModeValue("gray.900", "white")}>
            event<Box as="span" color="brand.600">light</Box>
          </Text>
        </HStack>

        <VStack align="stretch" spacing={8} maxW="380px" w="full" mx="auto">

          {/* No token in URL */}
          {!token ? (
            <VStack spacing={6} align="center" py={8}>
              <Box
                w="64px" h="64px" borderRadius="full"
                bg={useColorModeValue("orange.50", "orange.900")}
                display="flex" alignItems="center" justifyContent="center"
              >
                <Icon as={FiAlertCircle} boxSize={7} color="orange.400" />
              </Box>
              <VStack spacing={2} textAlign="center">
                <Heading size="md" letterSpacing="-0.03em">Invalid reset link</Heading>
                <Text color={mutedColor} fontSize="sm" maxW="300px" lineHeight="1.6">
                  This link is missing a reset token. Please request a new password reset.
                </Text>
              </VStack>
              <Button
                as={Link}
                to="/auth/forgot-password"
                variant="brand"
                borderRadius="xl"
                w="full"
                h="46px"
                fontSize="sm"
              >
                Request a new link
              </Button>
            </VStack>
          ) : success ? (
            /* Success state */
            <VStack spacing={6} align="center" py={8}>
              <Box
                w="64px" h="64px" borderRadius="full"
                bg={useColorModeValue("green.50", "green.900")}
                display="flex" alignItems="center" justifyContent="center"
              >
                <Icon as={FiCheckCircle} boxSize={7} color="green.500" />
              </Box>
              <VStack spacing={2} textAlign="center">
                <Heading size="md" letterSpacing="-0.03em">Password updated!</Heading>
                <Text color={mutedColor} fontSize="sm" maxW="300px" lineHeight="1.6">
                  Your password has been reset. Redirecting you to sign in…
                </Text>
              </VStack>
              <ChakraLink
                as={Link}
                to="/auth/login"
                fontSize="sm"
                color="brand.500"
                fontWeight="600"
                _hover={{ color: "brand.700" }}
              >
                Go to sign in now
              </ChakraLink>
            </VStack>
          ) : (
            /* Reset form */
            <>
              <VStack align="start" spacing={1}>
                <Heading size="lg" letterSpacing="-0.03em">Set new password</Heading>
                <Text color={mutedColor} fontSize="sm">
                  Enter and confirm your new password below.
                </Text>
              </VStack>

              {errors.length > 0 && (
                <Alert status="error" borderRadius="xl" fontSize="sm">
                  <AlertIcon />
                  <VStack align="start" spacing={0.5}>
                    {errors.map((e, i) => <Text key={i}>{e}</Text>)}
                    {isTokenError && (
                      <ChakraLink
                        as={Link}
                        to="/auth/forgot-password"
                        color="red.600"
                        fontWeight="700"
                        fontSize="xs"
                        mt={1}
                      >
                        Request a new reset link →
                      </ChakraLink>
                    )}
                  </VStack>
                </Alert>
              )}

              <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="600" color={labelColor}>
                      New password
                    </FormLabel>
                    <InputGroup>
                      <Input
                        name="new_password1"
                        type={showPass1 ? "text" : "password"}
                        value={formData.new_password1}
                        onChange={handleChange}
                        placeholder="At least 8 characters"
                        pr="3rem"
                        {...inputProps}
                      />
                      <InputRightElement h="46px">
                        <IconButton
                          aria-label={showPass1 ? "Hide" : "Show"}
                          icon={showPass1 ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                          variant="ghost" size="sm" borderRadius="full" color={mutedColor}
                          onClick={() => setShowPass1((s) => !s)}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="600" color={labelColor}>
                      Confirm new password
                    </FormLabel>
                    <InputGroup>
                      <Input
                        name="new_password2"
                        type={showPass2 ? "text" : "password"}
                        value={formData.new_password2}
                        onChange={handleChange}
                        placeholder="Repeat your new password"
                        pr="3rem"
                        {...inputProps}
                      />
                      <InputRightElement h="46px">
                        <IconButton
                          aria-label={showPass2 ? "Hide" : "Show"}
                          icon={showPass2 ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                          variant="ghost" size="sm" borderRadius="full" color={mutedColor}
                          onClick={() => setShowPass2((s) => !s)}
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
                    loadingText="Updating…"
                    mt={1}
                  >
                    Update password
                  </Button>
                </VStack>
              </form>

              <Text textAlign="center" fontSize="sm" color={mutedColor}>
                <ChakraLink
                  as={Link}
                  to="/auth/login"
                  color="brand.600"
                  fontWeight="700"
                  _hover={{ color: "brand.700" }}
                >
                  Back to sign in
                </ChakraLink>
              </Text>
            </>
          )}
        </VStack>
      </Flex>
    </Flex>
  );
};

export default ResetPassword;
