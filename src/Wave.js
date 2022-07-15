/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useEffect, useState } from "react";
import "./App.css";
import truncateEthAddress from "truncate-eth-address";
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Icon,
  useColorModeValue,
  createIcon,
  Link,
  Input,
  Flex,
  Spacer,
  SimpleGrid,
  useDisclosure,
  Collapse,
} from "@chakra-ui/react";
import { FaRegClock } from "react-icons/fa";
import abi from "./utils/WavePortal.json";
import ConnectBtn from "./ConnectBtn";
import { useAccount, useContract, useSigner } from "wagmi";
import { ethers } from "ethers";
import useToastHook from "./useToastHook";

export default function Wave() {
  const { isConnected } = useAccount();
  const [allWaves, setAllWaves] = useState([]);
  const [waverMessage, setWaverMessage] = useState("gm");
  const { data: signer } = useSigner();
  const [state, newToast] = useToastHook();

  const { isOpen, onToggle } = useDisclosure();

  const contractAddress = "0xDACfe2375AB4f4Bf28F434aC3Cb950ee5D9f09C0";
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have metamask");
      } else {
        console.log("We have the Ethereum Object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });
      getAllWaves();

      if (accounts.length !== 0) {
        console.log("Authorised account:", accounts[0]);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const wavePortalContract = useContract({
    addressOrName: contractAddress,
    contractInterface: contractABI,
    signerOrProvider: signer,
  });

  const wave = async () => {
    let count = await wavePortalContract.getTotalWaves();
    console.log("Retrieved total wave count....", count.toNumber());

    const waveTxn = await wavePortalContract.wave(waverMessage);
    console.log("Mining...", waveTxn.hash);
    newToast({ message: "Mining in progress", status: "success" });
    await waveTxn.wait();
    console.log("Mined...", waveTxn.hash);
    newToast({
      message: "Your wave is mined to the blockchain",
      status: "success",
    });
    count = await wavePortalContract.getTotalWaves();
    console.log("Retrieved total wave count....", count.toNumber());
  };

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];
        waves.forEach((wave) => {
          wavesCleaned.unshift({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          });
        });
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {}
  };

  const Arrow = createIcon({
    displayName: "Arrow",
    viewBox: "0 0 72 24",
    path: (
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M0.600904 7.08166C0.764293 6.8879 1.01492 6.79004 1.26654 6.82177C2.83216 7.01918 5.20326 7.24581 7.54543 7.23964C9.92491 7.23338 12.1351 6.98464 13.4704 6.32142C13.84 6.13785 14.2885 6.28805 14.4722 6.65692C14.6559 7.02578 14.5052 7.47362 14.1356 7.6572C12.4625 8.48822 9.94063 8.72541 7.54852 8.7317C5.67514 8.73663 3.79547 8.5985 2.29921 8.44247C2.80955 9.59638 3.50943 10.6396 4.24665 11.7384C4.39435 11.9585 4.54354 12.1809 4.69301 12.4068C5.79543 14.0733 6.88128 15.8995 7.1179 18.2636C7.15893 18.6735 6.85928 19.0393 6.4486 19.0805C6.03792 19.1217 5.67174 18.8227 5.6307 18.4128C5.43271 16.4346 4.52957 14.868 3.4457 13.2296C3.3058 13.0181 3.16221 12.8046 3.01684 12.5885C2.05899 11.1646 1.02372 9.62564 0.457909 7.78069C0.383671 7.53862 0.437515 7.27541 0.600904 7.08166ZM5.52039 10.2248C5.77662 9.90161 6.24663 9.84687 6.57018 10.1025C16.4834 17.9344 29.9158 22.4064 42.0781 21.4773C54.1988 20.5514 65.0339 14.2748 69.9746 0.584299C70.1145 0.196597 70.5427 -0.0046455 70.931 0.134813C71.3193 0.274276 71.5206 0.70162 71.3807 1.08932C66.2105 15.4159 54.8056 22.0014 42.1913 22.965C29.6185 23.9254 15.8207 19.3142 5.64226 11.2727C5.31871 11.0171 5.26415 10.5479 5.52039 10.2248Z'
        fill='currentColor'
      />
    ),
  });

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <>
      <Container
        maxW={"3xl"}
        py={{ base: 10, md: 10 }}
        fontFamily={"Montserrat"}>
        <Flex>
          <Text fontWeight={"bold"} fontSize={"3xl"} className='head'>
            WavePortal
          </Text>
          <Spacer />
          <ConnectBtn />
        </Flex>
        <Stack
          as={Box}
          textAlign={"center"}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 16, md: 32 }}>
          <Heading
            fontWeight={"bold"}
            fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
            color={"purple.600"}>
            GM👋 I'm Vijeth
            <Text
              fontWeight={"normal"}
              fontSize={{ base: "xl", sm: "2xl", md: "4xl" }}>
              I write smart contracts and build web apps :)
            </Text>
          </Heading>
          <Text color={"gray.800"} textAlign='justify'>
            This DApp allows a user to send messages to the smart contract owner
            (the user who deployed the smart contract to the blockchain), that's
            me. Every message sent is a transaction on the blockchain, which
            incurs gas fees. Since this is deployed on Polygon, the gas fees is
            absolute minimum (also, this is on testnet, no real money needed :P)
          </Text>
          <Stack
            direction={"column"}
            spacing={3}
            align={"center"}
            alignSelf={"center"}
            position={"relative"}>
            {isConnected ? (
              <>
                <Input
                  width={["sm", "md", "xl"]}
                  name='waverMessage'
                  placeholder='gm'
                  onChange={(e) => setWaverMessage(e.target.value)}
                  required
                />
                <Button
                  colorScheme={"purple"}
                  bg={"purple.500"}
                  px={6}
                  _hover={{
                    bg: "purple.600",
                  }}
                  onClick={wave}>
                  Send Message
                </Button>
              </>
            ) : (
              <ConnectBtn />
            )}

            <Button variant={"link"} colorScheme={"blue"} size={"sm"}>
              <Link href='https://faucet.polygon.technology/' isExternal>
                Click here for Testnet Matic
              </Link>
            </Button>
            <Box>
              <Icon
                as={Arrow}
                color={useColorModeValue("gray.800", "gray.300")}
                w={71}
                position={"absolute"}
                right={-71}
                top={"10px"}
              />
              <Text
                fontSize={"lg"}
                fontFamily={"Caveat"}
                position={"absolute"}
                right={"-100px"}
                top={"-15px"}
                transform={"rotate(10deg)"}>
                Say GM!
              </Text>
            </Box>
          </Stack>
        </Stack>
        <Stack>
          {allWaves.length > 0 ? (
            <>
              <Flex>
                <Text fontWeight={"bold"} fontSize={"xl"} className='head'>
                  gm history
                </Text>
                <Spacer />
                <Button onClick={onToggle}>{isOpen ? "Hide" : "Show"}</Button>
              </Flex>
              <Collapse in={isOpen} animateOpacity>
                <Box mt='4'>
                  <SimpleGrid columns={[1, 1, 2, 3]} spacing={5}>
                    {allWaves.map((wave, index) => {
                      const temp = wave.timestamp.toString().split(" ");
                      const time1 = temp[4].slice(0, 5);
                      const waveTime = `${temp[1]} ${temp[2]}, ${time1}`;
                      return (
                        <Box
                          w='100%'
                          bg='purple.50'
                          py={4}
                          px={2}
                          key={index}
                          borderRadius={"lg"}>
                          <Text mb={5}>{wave.message}</Text>
                          <Flex alignItems={"center"}>
                            <Text fontSize={"sm"}>
                              {truncateEthAddress(wave.address)}
                            </Text>
                            <Spacer />
                            <Flex
                              bg='white'
                              color='purple.500'
                              borderRadius={"lg"}
                              px={1}
                              justifyContent={"space-between"}
                              alignItems={"center"}>
                              <FaRegClock />
                              <Text fontSize={"sm"}>&nbsp;{waveTime}</Text>
                            </Flex>
                          </Flex>
                        </Box>
                      );
                    })}{" "}
                  </SimpleGrid>
                </Box>
              </Collapse>
            </>
          ) : (
            ""
          )}
        </Stack>
        <Stack pt={"25px"}>
          <Text align={"center"}>
            Design by{" "}
            <Link
              color={"purple.600"}
              fontWeight='bold'
              href='https://twitter.com/naved_ux'
              isExternal>
              Naved
            </Link>{" "}
            <br />
            Built by{" "}
            <Link
              color={"purple.600"}
              fontWeight='bold'
              href='https://twitter.com/vijethx'
              isExternal>
              Vijeth
            </Link>{" "}
            w/{" "}
            <Link
              href='https://twitter.com/_buildspace'
              color={"purple.600"}
              fontWeight='bold'
              isExternal>
              Buildspace
            </Link>
          </Text>
        </Stack>
      </Container>
    </>
  );
}
