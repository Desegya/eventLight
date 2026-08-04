import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  Heading,
  Text,
  HStack,
  IconButton,
  Alert,
  AlertIcon,
  Link as ChakraLink,
  Image,
  Icon,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { FiArrowLeft, FiMail, FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import { authService, AuthError } from "../services/auth";
import logo from "../assets/logo.svg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Email is required"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email address"); return; }
    setError(null);
    setLoading(true);
    try {
      await authService.resetPassword({ email });
      setSubmitted(true);
    } catch (err) {
      if (err instanceof AuthError && err.errors?.email) {
        setError(err.errors.email[0]);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
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
              <circle cx="145" cy="140" r="118" fill="url(#radialGlowFP)" opacity="0.7"/>
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
              <rect x="51" y="64" width="186" height="88" rx="14" fill="url(#heroGradientFP)"/>
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
              <radialGradient id="radialGlowFP" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="rgba(139,92,246,0.38)"/>
                <stop offset="100%" stopColor="rgba(139,92,246,0)"/>
              </radialGradient>
              <linearGradient id="heroGradientFP" x1="145" y1="64" x2="145" y2="152" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor="rgba(0,0,0,0)"/>
                <stop offset="100%" stopColor="rgba(0,0,0,0.45)"/>
              </linearGradient>
            </defs>
          </svg>
        </Box>

        <VStack align="start" spacing={5} position="relative" zIndex={1}>
          <VStack align="start" spacing={2}>
            <Text fontSize="3xl" fontWeight="800" letterSpacing="-0.04em" color="white" lineHeight="1.15">
              Happens to<br />everyone.
            </Text>
            <Text color="rgba(196,181,253,0.8)" fontSize="md" lineHeight="1.6" maxW="340px">
              Enter your email and we'll send you a link to get back into your account.
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
          {submitted ? (
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
                <Heading size="md" letterSpacing="-0.03em">Check your inbox</Heading>
                <Text color={mutedColor} fontSize="sm" maxW="300px" lineHeight="1.6">
                  If <strong>{email}</strong> is registered, you'll receive a reset link shortly. Check your spam folder if it doesn't arrive.
                </Text>
              </VStack>
              <VStack spacing={3} w="full">
                <Button
                  variant="brand"
                  borderRadius="xl"
                  w="full"
                  h="46px"
                  fontSize="sm"
                  onClick={() => { setSubmitted(false); setEmail(""); }}
                >
                  Send another link
                </Button>
                <ChakraLink
                  as={Link}
                  to="/auth/login"
                  fontSize="sm"
                  color="brand.500"
                  fontWeight="600"
                  _hover={{ color: "brand.700" }}
                >
                  Back to sign in
                </ChakraLink>
              </VStack>
            </VStack>
          ) : (
            /* Request form */
            <>
              <VStack align="start" spacing={1}>
                <Heading size="lg" letterSpacing="-0.03em">Forgot password?</Heading>
                <Text color={mutedColor} fontSize="sm">
                  Enter your email and we'll send you a reset link.
                </Text>
              </VStack>

              {error && (
                <Alert status="error" borderRadius="xl" fontSize="sm">
                  <AlertIcon />
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                <VStack spacing={5}>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="600" color={labelColor}>
                      Email address
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={FiMail} color={mutedColor} />
                      </InputLeftElement>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); if (error) setError(null); }}
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

                  <Button
                    type="submit"
                    variant="brand"
                    size="lg"
                    w="full"
                    borderRadius="xl"
                    h="46px"
                    fontSize="sm"
                    isLoading={loading}
                    loadingText="Sending…"
                  >
                    Send reset link
                  </Button>
                </VStack>
              </form>

              <Text textAlign="center" fontSize="sm" color={mutedColor}>
                Remember your password?{" "}
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
            </>
          )}
        </VStack>
      </Flex>
    </Flex>
  );
};

export default ForgotPassword;
