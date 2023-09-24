import {
  useTheme,
  IconButton,
  RelativeTime,
  Text,
  Tooltip,
  Avatar,
  PointerBox,
  ThemeProvider,
  BaseStyles,
  Box,
  Timeline,
  Octicon,
  Link,
} from '@primer/react';
import {
  PeopleIcon,
  LinkIcon,
  MarkGithubIcon,
  MailIcon,
  FileIcon,
  FileBadgeIcon,
  TrophyIcon,
  MortarBoardIcon,
  FlameIcon,
} from '@primer/octicons-react';
import content from './content.json';

function Background({ children }) {
  const { theme } = useTheme();
  return (
    <Box
      backgroundColor={theme.colors.canvas.default}
      px={4}
      minHeight="100vh"
      width="100%"
      display="flex"
      justifyContent="center"
    >
      <Box width={[theme.sizes.small, theme.sizes.medium, theme.sizes.large]}>
        { children }
      </Box>
    </Box>
  );
}

function TimelineItem({ timelineContent, type, date }) {
  const { theme } = useTheme();
  const getIcon = () => {
    switch (type) {
      case 'award': {
        return TrophyIcon;
      }
      case 'certification': {
        return FileBadgeIcon;
      }
      case 'education': {
        return MortarBoardIcon;
      }
      default: {
        return FlameIcon;
      }
    }
  };
  return (
    <Timeline.Item>
      <Timeline.Badge>
        <Octicon icon={getIcon()} />
      </Timeline.Badge>
      <Timeline.Body>
        <Box display="flex" sx={{ gap: '5px' }}>
          <Box
            sx={{
              a: {
                textDecoration: 'none',
                color: theme.colors.fg.default,
              },
              'a:hover': {
                color: theme.colors.fg.muted,
              },
            }}
            dangerouslySetInnerHTML={{ __html: timelineContent }}
          />
          <RelativeTime date={new Date(`${date}T00:00:00`)} tense="past" />
        </Box>
      </Timeline.Body>
    </Timeline.Item>
  );
}

function DialogContent() {
  function getSocialIcon(key) {
    switch (key) {
      case 'linkedin': {
        return <Octicon icon={PeopleIcon} />;
      }
      case 'github': {
        return <Octicon icon={MarkGithubIcon} />;
      }
      case 'email': {
        return <Octicon icon={MailIcon} />;
      }
      case 'resume': {
        return <Octicon icon={FileIcon} />;
      }
      default: {
        return <Octicon icon={LinkIcon} />;
      }
    }
  }
  return (
    <Box>
      <Text>
        { content.intro }
      </Text>
      <Box display="flex" mt={2} sx={{ gap: '10px' }}>
        {
          content.socials.map((social) => (
            <Tooltip aria-label={social.title} direction="s" key={social.id}>
              <IconButton
                as={Link}
                href={social.url}
                target="_blank"
                aria-label={social.title}
                variant="default"
                sx={{ borderRadius: '100%' }}
              >
                { getSocialIcon(social.id) }
              </IconButton>
            </Tooltip>
          ))
        }
      </Box>
    </Box>
  );
}

function DialogHeader() {
  const { theme } = useTheme();
  return (
    <Box display="flex">
      <Box
        display={['block', 'none', 'none']}
        position="relative"
        width="100%"
        sx={{
          'svg[role=presentation] path': { fill: theme.colors.canvas.subtle },
          svg: { left: '27px!important' },
        }}
      >
        <PointerBox
          minHeight={100}
          caret="top-left"
        >
          <Box
            p={1}
            pl={2}
            backgroundColor={theme.colors.canvas.subtle}
            borderTopLeftRadius={theme.radii[2]}
            borderTopRightRadius={theme.radii[2]}
          >
            <Text sx={{ fontSize: theme.fontSizes[0] }}>
              <Link
                href="/"
                sx={{ fontWeight: 'bold', color: 'fg.default', mr: 1 }}
              >
                { content.name }
              </Link>
              { content.lastUpdatedSubtext }
            </Text>
          </Box>
          <Box
            p={3}
            borderTop={`${theme.borderWidths[1]} solid ${theme.colors.canvas.subtle}`}
          >
            <DialogContent />
          </Box>
        </PointerBox>
      </Box>
      <Box
        display={['none', 'block', 'block']}
        position="relative"
        width="100%"
        sx={{
          'svg[role=presentation] path': { fill: theme.colors.canvas.subtle },
        }}
      >
        <PointerBox
          minHeight={100}
          caret="left-top"
        >
          <Box
            p={1}
            pl={2}
            backgroundColor={theme.colors.canvas.subtle}
            borderTopLeftRadius={theme.radii[2]}
            borderTopRightRadius={theme.radii[2]}
          >
            <Text sx={{ fontSize: theme.fontSizes[0] }}>
              <Link
                href="/"
                sx={{ fontWeight: 'bold', color: 'fg.default', mr: 1 }}
              >
                { content.name }
              </Link>
              { content.lastUpdatedSubtext }
            </Text>
          </Box>
          <Box
            p={3}
            borderTop={`${theme.borderWidths[1]} solid ${theme.colors.canvas.subtle}`}
          >
            <DialogContent />
          </Box>
        </PointerBox>
      </Box>
    </Box>
  );
}

function TimelineDialog({
  badgeImage, name, date, url, timelineContent,
}) {
  const { theme } = useTheme();
  return (
    <Box display="flex">
      <Box
        display={['block', 'none', 'none']}
        position="relative"
        width="100%"
        sx={{
          'svg[role=presentation]': { display: 'none' },
        }}
      >
        <PointerBox
          minHeight={100}
          caret="top-left"
        >
          <Box
            p={1}
            pl={2}
            backgroundColor={theme.colors.canvas.subtle}
            borderTopLeftRadius={theme.radii[2]}
            borderTopRightRadius={theme.radii[2]}
          >
            <Text sx={{ fontSize: theme.fontSizes[0] }}>
              <Link
                href={url}
                target="_blank"
                sx={{ fontWeight: 'bold', color: 'fg.default', mr: 1 }}
              >
                { name }
              </Link>
              {
                new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
                  month: 'long',
                  year: 'numeric',
                })
              }
            </Text>
          </Box>
          <Box
            p={3}
            borderTop={`${theme.borderWidths[1]} solid ${theme.colors.canvas.subtle}`}
            sx={{ a: { color: theme.colors.accent.fg } }}
            dangerouslySetInnerHTML={{ __html: timelineContent }}
          />
        </PointerBox>
      </Box>
      <Box
        display={['none', 'block', 'block']}
        position="relative"
        width="100%"
        sx={{
          'svg[role=presentation] path': { fill: theme.colors.canvas.subtle },
        }}
      >
        <Link href={url} target="_blank">
          <Avatar
            sx={{ position: 'absolute', left: '-90px', top: '-20px' }}
            src={badgeImage}
            size={72}
            square
          />
        </Link>
        <PointerBox
          minHeight={100}
          caret="left-top"
        >
          <Box
            p={1}
            pl={2}
            backgroundColor={theme.colors.canvas.subtle}
            borderTopLeftRadius={theme.radii[2]}
            borderTopRightRadius={theme.radii[2]}
          >
            <Text sx={{ fontSize: theme.fontSizes[0] }}>
              <Link
                href={url}
                target="_blank"
                sx={{ fontWeight: 'bold', color: 'fg.default', mr: 1 }}
              >
                { name }
              </Link>
              {
                new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
                  month: 'long',
                  year: 'numeric',
                })
              }
            </Text>
          </Box>
          <Box
            p={3}
            borderTop={`${theme.borderWidths[1]} solid ${theme.colors.canvas.subtle}`}
            sx={{ a: { color: theme.colors.accent.fg } }}
            dangerouslySetInnerHTML={{ __html: timelineContent }}
          />
        </PointerBox>
      </Box>
    </Box>
  );
}

function TimelineBox({ children }) {
  return (
    <Box
      mt={3}
      pb={4}
      width="100%"
    >
      { children }
    </Box>
  );
}

export default function App() {
  const timelineItems = [
    ...content.timeline.map((timeline) => ({
      key: timeline.content + timeline.date,
      date: new Date(`${timeline.date}T00:00:00`),
      component: (key) => (
        <TimelineItem
          timelineContent={timeline.content}
          date={timeline.date}
          type={timeline.type}
          key={key}
        />
      ),
    })),
    ...content.milestones.map((milestone) => ({
      key: milestone.name + milestone.date,
      date: new Date(`${milestone.date}T00:00:00`),
      component: (key) => (
        <Box key={key}>
          <Timeline.Item />
          <TimelineDialog
            name={milestone.name}
            date={milestone.date}
            url={milestone.url}
            timelineContent={milestone.content}
            badgeImage={milestone.badgeImage}
          />
        </Box>
      ),
    })),
  ];

  return (
    <ThemeProvider colorMode="auto" nightScheme="dark_dimmed">
      <BaseStyles>
        <Background>
          <Box display="flex" flexDirection={['column', 'row', 'row']} mt={4}>
            <Box mr={3}>
              <Link href="/">
                <Avatar src={content.profileImage} size={72} />
              </Link>
            </Box>
            <TimelineBox>
              <DialogHeader />
              <Timeline>
                {
                  timelineItems
                    .sort((a, b) => (a.date < b.date ? 1 : -1))
                    .map((item) => item.component(item.key))
                }
              </Timeline>
            </TimelineBox>
          </Box>
        </Background>
      </BaseStyles>
    </ThemeProvider>
  );
}
