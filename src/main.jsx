import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider, BaseStyles } from '@primer/react';
import App from './App';
import Blog from './Blog';
import Background from './Background';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/blogs/:blogId',
    element: <Blog />,
  },
]);

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
