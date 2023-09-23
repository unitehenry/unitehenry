import {
  useTheme,
  Text,
  Avatar,
  PointerBox,
  ThemeProvider,
  BaseStyles,
  Box,
  Timeline,
  Octicon,
  Link,
} from '@primer/react';
import { FlameIcon } from '@primer/octicons-react';
import ProfileImg from './assets/profile.jpg';

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

function DialogHeader() {
  const { theme } = useTheme();
  return (
    <Box display="flex">
      <Box display={['block', 'none', 'none']} position="relative" width="100%" sx={{
          'svg path': { fill: theme.colors.canvas.subtle },
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
                Henry Unite
              </Link>
              last updated this on September 30th, 2023
            </Text>
          </Box>
          <Box
            p={3}
            borderTop={`${theme.borderWidths[1]} solid ${theme.colors.canvas.subtle}`}>
              Content
          </Box>
        </PointerBox>
      </Box>
      <Box display={[ 'none', 'block', 'block' ]} position="relative" width="100%" sx={{
          'svg path': { fill: theme.colors.canvas.subtle },
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
                Henry Unite
              </Link>
              last updated this on September 30th, 2023
            </Text>
          </Box>
          <Box
            p={3}
            borderTop={`${theme.borderWidths[1]} solid ${theme.colors.canvas.subtle}`}>
              Content
          </Box>
        </PointerBox>
      </Box>
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
            <Box mt={3} width="100%">
              <DialogHeader />
              <Timeline>
                <TimelineItem />
                <TimelineItem />
              </Timeline>
            </Box>
          </Box>
        </Background>
      </BaseStyles>
    </ThemeProvider>
  )
}
