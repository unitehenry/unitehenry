+++
title = "Building My Portfolio Website With Nextjs"
date = "2020-11-20"
tags = []
+++

It's time for a new portfolio website! This time I decided to use Next.js to generate my static site with these principles in mind:

1.  Take a [README](https://github.com/unitehenry/unitehenry/blob/master/README.md) markdown file of my resume and convert it to a static homepage
2.  Use [semantic HTML](https://www.w3schools.com/html/html5_semantic_elements.asp) with global styles for easy customization
3.  Adding [next pages](https://nextjs.org/docs/basic-features/pages) will append links to the homepage

## README Conversion

The core concepts of this project are built on the foundation of these methods:

1.  Bootstrap a [create-next-app](https://nextjs.org/docs/api-reference/create-next-app)
2.  Use the [getStaticProps](https://nextjs.org/docs/basic-features/data-fetching) to generate HTML from the README with [showdown](https://github.com/showdownjs/showdown)
3.  Use [dangerouslySetInnerHTML](https://reactjs.org/docs/dom-elements.html) for SEO optimization

### Getting Started with Next

We can start bootstrapping our application using the [create-next-app](https://nextjs.org/docs/api-reference/create-next-app) npm script.

{{< highlight bash >}}
$ npx create-next-app
{{< / highlight >}}

### Generating HTML from README

Using [getStaticProps](https://nextjs.org/docs/basic-features/data-fetching) and [showdown](https://github.com/showdownjs/showdown), we can generate some HTML to use for our site generation.

{{< highlight js >}}
export async function getStaticProps() {
  const path = require('path');
  const fs = require('fs');
  const { Converter } = require('showdown');
  const converter = new Converter();

  function parseREADME() {
    return new Promise((res) => {
      fs.readFile(path.join(process.cwd(), 'README.md'), (err, data) => {
        const readme = data.toString();
        const html = converter.makeHtml(pReadme);
        res(html);
      });
    });
  }

  const html = await parseREADME();

  return {
    props: { html },
  };
}
{{< / highlight >}}

### Serving HTML optimized for SEO

The key to using [dangerouslySetInnerHTML](https://reactjs.org/docs/dom-elements.html) with next.js is that we want to ensure the content of our HTML is served as static content for SEO.

{{< highlight jsx >}}
return (
    <div>
      <Head>
        <title> {title} </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main dangerouslySetInnerHTML={{ __html: html }} />

      <footer> 

      </footer>
    </div>
  );
{{< / highlight >}}

## Semantic Styling

After your content is being injected in the page, you should be staring at a wall of black and white text like this:

!["Unstyled README Homepage"](/images/b568ca02-3d59-4bf6-8633-8f88d1823de5.png)

Using the [global.css](https://nextjs.org/docs/basic-features/built-in-css-support) file provided by next, we can globally style semantic elements like this:

{{< highlight css >}}
body {
     /* CSS Styles */
}

main {
     /* CSS Styles */
}

main hr {
     /* CSS Styles */
}

main strong {
     /* CSS Styles */
}

main p {
     /* CSS Styles */
}

main h1, main h2, main h3, main h4, main h5, main h6 {
     /* CSS Styles */
}

main ul, main ol {
     /* CSS Styles */
}

main li {
     /* CSS Styles */
}

main a {
     /* CSS Styles */
}
{{< / highlight >}}

## Page Extensibility

One of the design concepts I wanted to implement was the idea that you could add a next page in the pages directory and a navigation link be appended to the homepage.

Taking advantage of the the [getStaticProps](https://nextjs.org/docs/basic-features/data-fetching) function, we can use node to read the directory, exclude unrelated files, and generate links in our homepage.

{{< highlight javascript >}}
// CONFIG['pageExcludes'] = [ 'app', 'api', 'index']

  function getPages() {
    return new Promise((res) => {
      fs.readdir(path.join(process.cwd(), 'pages'), (err, data) => {
        const pageFiles = data.filter((f) => {
          return !CONFIG['pageExcludes'].filter((ex) => f.includes(ex)).pop();
        });

        res(pageFiles.map((p) => p.replace('.js', '')));
      });
    });
  }

  const html = await parseREADME();
  const pages = await getPages();

  return {
    props: { html, pages },
  };
{{< / highlight >}}

{{< highlight jsx >}}
      <footer> 
        <div id="pages">
          { pages.map((p) => p ? <a key={p} href={`/${p}`}>{ p }</a> : null }
        </div>
      </footer>
{{< / highlight >}}

### Gathering my Blog Post Data

With this feature, I can now create unique CMS pages to extend my static site. Let's create a blog page to fetch my DEV posts.

I'll be using the [axios](https://github.com/axios/axios) library to make a request to the DEV api, gather my posts data, and send those props to the page for static site generation. Again, taking advantage of the [getStaticProps](https://nextjs.org/docs/basic-features/data-fetching) hook.

{{< highlight javascript >}}
// pages/blog.js

export async function getStaticProps() {
  const axios = require('axios');

  function getArticle() {
    return new Promise(async (res) => {
      const req = await axios({
        method: 'GET',
        url: 'https://dev.to/api/articles?username=unitehenry'
      });

      if(req['data']) {
        try {
          const data = req['data'];
          res(data.map((article) => {
            return {
              title: article['title'], 
              description: article['description'], 
              url: article['url'],
              date: article['created_at'],
              image: article['cover_image']
            };
          })); 
        } catch(e) {
          res([]);
        }
      } else {
        res([]);
      }
    }); 

  }

  const articles = await getArticle();

  return {
    props: { articles }
  }
}
{{< / highlight >}}

{{< highlight jsx >}}
        <section>

        { (articles.length === 0) && <p>No Blog Posts</p>}

        {
          articles.map(({ title, description, date, url, image }) => {
            return (
              <article key={title} className={style['blog-article']}>
                { image ? <img src={image} /> : null}
                <div className={style['blog-article-content']}>
                  <h2>{ title }</h2>
                  <p>{ description }</p>
                  <a title="Read Article" className={style['blog-button']} href={url} target="_blank">Read Article</a>
                </div>
              </article>
            );
          })
        }

        </section>
{{< / highlight >}}

!["Portfolio Footer Pages"](/images/7f6ed5e9-a9b8-45bb-b91a-43686d661b42.png)

## Bootstrapping of my Repository

If you want to see the source code or fork this repo and generate your own static site, I've created a [GitHub repository](https://github.com/unitehenry/unitehenry) and [documented in detail](https://github.com/unitehenry/unitehenry/wiki) how to customize the code for your own static portfolio site.

### GitHub Trick

As a side note, there is a [GitHub trick](https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-your-github-profile/managing-your-profile-readme) that will take your README and display it on your GitHub profile as well.

!["GitHub Profile"](/images/3f889b6e-e224-44d1-b895-f3cf2462800c.png)
