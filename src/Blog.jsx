import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  useTheme, Box, Heading, Link, Text,
} from '@primer/react';
import hljs from 'highlight.js';
import content from './content.json';
import 'highlight.js/styles/github-dark-dimmed.css';

export default function Blog() {
  const { blogId } = useParams();

  const { theme } = useTheme();

  const [blogContent, setBlogContent] = useState('');

  const blog = content.blogs.find((b) => b.id === blogId);

  useEffect(() => {
    fetch(blog.contentUrl)
      .then((res) => res.text().then((txt) => setBlogContent(txt)));
    hljs.highlightAll();
  });

  return (
    <Box py={4}>
      <Box>
        <Link href="/">
          { content.blogReturnToText }
        </Link>
        <Heading sx={{ fontSize: 6, mb: 2 }}>
          { blog.title }
        </Heading>
        <Text color={theme.colors.fg.muted}>
          { content.blogPostedOn }
          {' '}
          {new Date(`${blog.date}T00:00:00`).toLocaleDateString(undefined, {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </Text>
      </Box>
      <Box
        sx={{
          a: {
            color: theme.colors.accent.fg,
          },
          img: {
            maxWidth: '100%',
          },
          code: {
            borderWidth: theme.borderWidths[1],
            borderColor: theme.colors.border.muted,
            borderStyle: 'solid',
            borderRadius: theme.radii[2],
            maxWidth: '90vw',
          },
          'p:has(img)': {
            display: 'flex',
            justifyContent: 'center',
          },
        }}
        dangerouslySetInnerHTML={{ __html: blogContent }}
      />
    </Box>
  );
}
