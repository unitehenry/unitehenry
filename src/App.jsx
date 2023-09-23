import {
  useTheme,
  ThemeProvider,
  BaseStyles,
  Button,
  Box
} from '@primer/react';

function Background({ children }) {
  const { theme } = useTheme();
  return (
    <Box backgroundColor={theme.colors.canvas.default} p={4} minHeight="100vh">
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider colorMode="auto" nightScheme="dark_dimmed">
      <BaseStyles>
        <Background>
          <Button>My Button</Button>
        </Background>
      </BaseStyles>
    </ThemeProvider>
  )
}
