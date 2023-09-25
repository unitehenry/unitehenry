import { useTheme, Box } from '@primer/react';

export default function Background({ children }) {
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
