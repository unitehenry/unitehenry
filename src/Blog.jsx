import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme, Box, Heading, Link, Text } from '@primer/react';
import content from './content.json';

export default function Blog() {

  const { blogId } = useParams();

  const { theme } = useTheme();

  const [ blogContent, setBlogContent ] = useState('');

  const blog = content.blogs.find(blog => blog.id === blogId);

  useEffect(() => {
    fetch(blog.contentUrl)
      .then(res => res.text().then(txt => setBlogContent(txt)))
  })

  return (
    <Box py={4}>
      <Box>
        <Link href="/">
          Return to Homepage
        </Link>
        <Heading sx={{fontSize: 6, mb: 2}}>
          { blog.title }
        </Heading>
        <Text>
          
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
          'p:has(img)': {
            display: 'flex',
            justifyContent: 'center',
          }
        }}
        dangerouslySetInnerHTML={{ __html: blogContent }} />
    </Box>
  )

}
