import {
  useTheme,
  IconButton,
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
  FlameIcon
} from '@primer/octicons-react';
import ProfileImg from './assets/profile.jpg';
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
      justifyContent="center">
      <Box width={[theme.sizes.small, theme.sizes.medium, theme.sizes.large]}>
        { children }
      </Box>
    </Box>
  );
}

function TimelineItem() {
  return (
    <Timeline.Item>
      <Timeline.Badge>
        <Octicon icon={FlameIcon} />
      </Timeline.Badge>
      <Timeline.Body>
        <Link href="#" sx={{fontWeight: 'bold', color: 'fg.default', mr: 1}} muted>
          Monalisa
        </Link>
        created one <Link href="#" sx={{fontWeight: 'bold', color: 'fg.default', mr: 1}} muted>
          hot potato
        </Link>
        <Link href="#" color="fg.muted" muted>
          Just now
        </Link>
      </Timeline.Body>
    </Timeline.Item>
  )
}

function DialogContent() {
  function getSocialIcon(key) {
    switch(key) {
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
        { content['intro'] }
      </Text>
      <Box display="flex" mt={2} sx={{ gap: '10px' }}>
        {
          content['socials'].map(social => (
            <Tooltip aria-label={social.title} direction="s" key={social.id}>
              <IconButton
                as={Link}
                href={social.url}
                target="_blank"
                aria-label={social.title}
                variant="default"
                sx={{ borderRadius: '100%'}}>
                { getSocialIcon(social.id) }
              </IconButton>
            </Tooltip>
          ))
        }
      </Box>
    </Box>
  )
}

function DialogHeader() {
  const { theme } = useTheme();
  return (
    <Box display="flex">
      <Box display={['block', 'none', 'none']} position="relative" width="100%" sx={{
          'svg[role=presentation] path': { fill: theme.colors.canvas.subtle },
          'svg': { left: '27px!important' }
        }}>
        <PointerBox
          minHeight={100}
          caret={'top-left'}>
          <Box
            p={1}
            pl={2}
            backgroundColor={theme.colors.canvas.subtle}
            borderTopLeftRadius={theme.radii[2]}
            borderTopRightRadius={theme.radii[2]}>
            <Text sx={{ fontSize: theme.fontSizes[0] }}>
              <Link
                href="#"
                sx={{fontWeight: 'bold', color: 'fg.default', mr: 1}}>
                { content['name'] }
              </Link>
              { content['lastUpdatedSubtext'] }
            </Text>
          </Box>
          <Box
            p={3}
            borderTop={`${theme.borderWidths[1]} solid ${theme.colors.canvas.subtle}`}>
              <DialogContent />
          </Box>
        </PointerBox>
      </Box>
      <Box display={[ 'none', 'block', 'block' ]} position="relative" width="100%" sx={{
          'svg[role=presentation] path': { fill: theme.colors.canvas.subtle },
        }}>
        <PointerBox
          minHeight={100}
          caret={'left-top'}>
          <Box
            p={1}
            pl={2}
            backgroundColor={theme.colors.canvas.subtle}
            borderTopLeftRadius={theme.radii[2]}
            borderTopRightRadius={theme.radii[2]}>
            <Text sx={{ fontSize: theme.fontSizes[0] }}>
              <Link
                href="#"
                sx={{fontWeight: 'bold', color: 'fg.default', mr: 1}}>
                { content['name'] }
              </Link>
              { content['lastUpdatedSubtext'] }
            </Text>
          </Box>
          <Box
            p={3}
            borderTop={`${theme.borderWidths[1]} solid ${theme.colors.canvas.subtle}`}>
            <DialogContent />
          </Box>
        </PointerBox>
      </Box>
    </Box>
  )
}

function TimelineBox({ children }) {
  const { theme } = useTheme();
  return (
    <Box
      mt={3}
      width="100%">
        { children }
      <Box
        height={2}
        backgroundColor={theme.colors.canvas.subtle}
        borderRadius={theme.radii[3]} />
    </Box>
  )
}

export default function App() {
  return (
    <ThemeProvider colorMode="auto" nightScheme="dark_dimmed">
      <BaseStyles>
        <Background>
          <Box display="flex" flexDirection={['column', 'row', 'row']} mt={4}>
            <Box mr={3}>
              <Avatar src={ProfileImg} size={72} />
            </Box>
            <TimelineBox>
              <DialogHeader />
              <Timeline>
                <TimelineItem />
                <TimelineItem />
              </Timeline>
            </TimelineBox>
          </Box>
        </Background>
      </BaseStyles>
    </ThemeProvider>
  )
}
