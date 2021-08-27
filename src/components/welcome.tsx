import { useMemo } from "react";
import Anime from "react-anime";
import { Flex, Heading, Link, Image } from "theme-ui";

import avatarUrl from "url:../media/avatar.png?as=png&width=50";

const greetings = [
  "Hello There",
  "Hey There",
  "Hi There",
  "Welcome",
  "Nice to see you",
];

export default () => {
  const greeting = useMemo(() => {
    return greetings[Math.round(Math.random() * (greetings.length - 1))];
  }, []);

  return (
    <Flex sx={{ justifyContent: "center" }}>
      <Flex
        sx={{
          flexDirection: "column",
          paddingTop: "200px",
        }}
      >
        <Flex sx={{ alignItems: "center" }}>
          <Image
            src={avatarUrl}
            variant="avatar"
            alt="A vector avatar depicting Ben Greenier's upper body."
            sx={{ borderRadius: "50%", marginRight: "15px" }}
          />
          <Heading as="h2">Ben Greenier ⚡</Heading>
        </Flex>
        <Anime
          duration={15000}
          autoplay={true}
          easing={"linear"}
          loop={true}
          direction={"alternate"}
          color={[
            "#F94144",
            "#F3722C",
            "#F8961E",
            "#F9C74F",
            "#90BE6D",
            "#43AA8B",
            "#577590",
          ]}
        >
          <Heading as="h1" sx={{ fontSize: "10vw" }}>
            {greeting}. <br />I Make Software.
          </Heading>
        </Anime>
        <Flex
          sx={{
            flexDirection: ["column", "row"],
            justifyContent: ["initial", "space-evenly"],
          }}
        >
          <Heading as="h2">
            <Link href="https://profile.bengreenier.com">Polywork</Link>
          </Heading>
          <Heading as="h2">
            <Link href="https://twitter.com/bengreenier">Twitter</Link>
          </Heading>
          <Heading as="h2">
            <Link href="https://github.com/bengreenier">GitHub</Link>
          </Heading>
          <Heading as="h2">
            <Link href="https://twitch.tv/ben_greenier">Twitch</Link>
          </Heading>
          <Heading as="h2">
            <Link href="https://www.linkedin.com/in/ben-greenier-1a72b55a/">
              LinkedIn
            </Link>
          </Heading>
          <Heading as="h2">
            <Link href="https://dev.to/bengreenier">DEV</Link>
          </Heading>
          <Heading as="h2">
            <Link href="https://www.buymeacoffee.com/bengreenier">
              Buy me a coffee
            </Link>
          </Heading>
        </Flex>
      </Flex>
    </Flex>
  );
};
