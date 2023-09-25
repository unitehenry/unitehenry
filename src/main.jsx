import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useTheme, ThemeProvider, BaseStyles, Box } from '@primer/react';
import App from './App';
import Blog from './Blog';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/blogs/:blogId',
    element: <Blog />
  }
]);

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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider colorMode="auto" nightScheme="dark_dimmed">
      <BaseStyles>
        <Background>
          <RouterProvider router={router} />
        </Background>
      </BaseStyles>
    </ThemeProvider>
  </React.StrictMode>,
);
