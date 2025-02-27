import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Link,
  Typography,
} from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";

import { Blog } from "../web/common/components/Blog.styles";
import { PaperMiddle } from "./about.styles";

const About: NextPage = () => {
  return (
    <>
      <Head>
        <title>About | Ameliorate</title>
        <meta
          name="description"
          content="Ameliorate is a tool that makes it easier to solve tough problems. Learn more about how ameliorate does this, its vision, mission, design principles, and roadmap."
        />
      </Head>

      <Blog>
        <Box display="flex" justifyContent="center">
          <PaperMiddle>
            <Typography variant="body1">
              Check out the
              <Link
                href="https://medium.com/@keyser.joel/a-dream-to-ameliorate-547353f37945"
                target="_blank"
              >
                announcement blog post
              </Link>
              for an in-depth explanation of the tool's ideas, along with the motivation, goals, and
              plans for the tool.
            </Typography>

            <Typography variant="h5">What is this?</Typography>
            <Typography variant="body1">
              This is a tool for solving controversial problems.
            </Typography>

            <Typography variant="body1">
              Its purpose is to help reason around hard decisions, and to enable that reasoning to
              be shared, mutually understood, and improved. It helps you lay out information in a
              way that is easy to digest, as well as critique and improve upon any individual piece
              without cluttering or disorganizing any of it.
            </Typography>

            <Typography variant="body1">
              The core idea is that you can map pieces of solutions to pieces of problems, compare
              the tradeoffs of each solution, and everything that you're claiming implicitly (e.g.
              this piece of the problem is the most important thing to solve, this piece of the
              solution addresses that problem) can clearly be justified and critiqued, in an
              off-to-the-side but easy-to-access way.
            </Typography>

            <Typography variant="body1">
              Disagreements should come down to differences in human/moral values, whereas right now
              they're often rooted in misunderstanding.
            </Typography>

            <Divider />

            <Typography variant="body1">
              When such same-pagedness is QED, the ultimate dream is to enhance the tool in order to
              enable any individual to gain traction on or contribute to solving any problem with
              <i> minutes </i> of effort, even if the problem is a mountain. This will require
              features for scaling collaboration and tracking ongoing efforts.
            </Typography>

            <Divider />

            <Typography variant="h5">Vision</Typography>
            <Typography variant="body1">Imagine a world where...</Typography>
            <Typography variant="body1">
              ... you never have to leave a conversation frustrated that you aren't understood, or
              that you can't understand someone else.
            </Typography>

            <Typography variant="body1">
              ... politicians and citizens of diverse perspectives can work together and be
              satisfied with decisions intended to better society.
            </Typography>

            <Typography variant="body1">
              ... ANYONE has the power to get traction on an overwhelming problem.
            </Typography>

            <Divider />

            <Typography variant="h5">Mission</Typography>
            <Typography variant="body1">
              Enable humanity to effectively solve problems through understanding their own
              differences and reasonings.
            </Typography>

            <Divider />
            <Typography variant="h5">Design Principles</Typography>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="body1">Accessible</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  <b>What</b>: Free for public use, a11y, performant, mobile, open source, easy to
                  use, i18n
                </Typography>
                <Typography variant="body1">
                  <b>Why</b>: Solving complex problems is hard, and it needs as many great minds as
                  possible. Diversity and perspective are critical. Accessibility is required to
                  maximize these.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="body1">Simple over precise</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  <b>What</b>: This type of app has a ton of possible features that can easily
                  overwhelm the user if not managed properly. Generally, features should not target
                  academics; this is a tool for the layperson.
                </Typography>
                <Typography variant="body1">
                  <b>Why</b>: Complexity is a huge barrier to accessibility; the learning curve to
                  use the tool must be low. This also applies to problem-solving - quickly conveying
                  high-level information makes the learning curve for a specific topic low.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Divider />

            <section id="release-status">
              <Typography variant="h5">Release Status</Typography>
              <Typography variant="body1">
                A release status conveys an expectation of how solid the tool is, though there will
                always be room for improvements and enhancements. These are the statuses:
              </Typography>
              <Typography variant="body1">
                <b>Alpha (current)</b>: tool is usable, core features exist but are unrefined, tool
                may feel clunky to use, bugs are expected, no established userbase
              </Typography>
              <Typography variant="body1">
                <b>Beta</b>: core features are somewhat refined, tool does not feel clunky to use,
                bugs are expected, established userbase is forming
              </Typography>
              <Typography variant="body1">
                <b>No label/fully-released</b>: core features are well-refined, tool feels smooth to
                use, bugs are rare, established userbase exists
              </Typography>
            </section>

            <Divider />

            <Typography variant="h5">Roadmap</Typography>
            <Link
              href="https://miro.com/app/board/uXjVODhExZM=/?share_link_id=328679592737"
              target="_blank"
              rel="noopener"
            >
              Long-term
            </Link>
            <Link
              href="https://github.com/orgs/amelioro/projects/2/views/1"
              target="_blank"
              rel="noopener"
            >
              Short-term
            </Link>
          </PaperMiddle>
        </Box>
      </Blog>
    </>
  );
};

export default About;
