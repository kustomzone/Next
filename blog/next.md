## Next.js 

Quick copy of blog post below without ani-gifs. (that post is currently causing hard crashes in Chome/Chromium, probably due to gif rendering - *still checking..*)

https://zeit.co/blog/next

> Naoyuki Kanezawa (@nkzawa), Guillermo Rauch (@rauchg) and Tony Kovanen (@tonykovanen)

We're very proud to open-source Next.js, a small framework for server-rendered universal JavaScript webapps, built on top of React, Webpack and Babel, which powers this very site!

The "Hello World" of Next.js

To start using it, run inside a new directory with a package.json:

```npm install next --save
$ mkdir pages
Populate pages/index.js:
import React from 'react'
export default () => <div>Hello world!</div>
and run:```

$ next

This blog post will go into the philosophy and design decisions of the project.

To learn how to use Next.js instead, please refer to the README, where you can learn the entirety of the tool's capabilities in just a few minutes.

First we'll dive into the background of the project and then describe 6 basic principles:

* Zero setup. Use the filesystem as an API
* Only JavaScript. Everything is a function
* Automatic server rendering and code splitting
* Data fetching is up to the developer
* Anticipation is the key to performance
* Simple deployment
* Background 

For many years now, we have been pursuing a vision of universal JavaScript applications.
Node.js led the way, by enabling code sharing between client and server, broadening the contribution surface for many developers around the world.

Many attempts were made to make it practical to develop apps and websites on Node. Many template languages and frameworks came along... but the technical divide between frontend and backend remained.

If you for example picked Express and Jade, some HTML would be rendered by the server and then a different codebase (powered by jQuery or similar libraries) would take over.
That situation was really no better than, say, PHP's. In many ways, PHP was actually more suited for the "server rendering of HTML" job. Prior to async/await, it was difficult to query data services in JS. Catching and limiting errors to the scope of the request/response was also notoriously difficult.

Since then, however, notable conceptual changes have allowed us to bridge this gap. The most important of which is the introduction of the pure render function that returns the representation of the UI based on the available data at that point in time.
This model (popularized by React) is of significant importance, but that alone is not necessarily different from how most template systems work. The other critical concept is the component lifecycle.

Lifecycle hooks allow us to handle the continuation of some rendering that originated on the server. You can start with a static representation of data, subscribe to realtime updates from a server, and change it over time, for example. Or perhaps it just remains static.
Next.js is our take on how to bring this vision forward.
Zero setup. Use the filesystem as an API 

Tools make certain assumptions about your projects' structure within the filesystem.
For example, we generally start a Node.js project by creating a new directory, placing a package.json inside, then installing modules into ./node_modules.
Next.js extends that structure by introducing a pages sub-directory where your top-level components live.

For example, you can populate pages/index.js which maps to the route / with:

import React from 'react'
export default () => <marquee>Hello world</marquee>
and then pages/about.js which maps to /about with:
import React from 'react'
export default () => <h2>About us</h2>
We believe this is a great default to get started with and allows for very quick exploration of a project. When more advanced routing is required, we'll allow developers to intercept the request and take control [#25].

All that's needed to start working on the project is to run:

$ next
No configuration unless it's needed. Automatic hot-code reloading, error reporting, source maps, transpilation for older browsers.

Only JavaScript. Everything is a function 

Every route within Next.js is simply a ES6 module that exports a function or class that extends from React.Component.
The advantages of this approach over similar models is that your entire system remains highly composable and testable. For example, a component can be rendered directly, or be imported and rendered by another top-level component.

Components can also introduce changes to the <head> of the page:
import React from 'react'
import Head from 'next/head'
export default () => (
  <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <h2>Hi. I'm mobile-ready!</h2>
  </div>
)

Furthermore, no wrappers or transformations are needed to make this system fully testable. Your test suite can simply import and shallow-render your routes.

We've also made the decision to embrace CSS-in-JS. We use the excellent glamor library which gives us the full unconstrained power of CSS without the need for CSS parsing and compilation:
import React from 'react'
import css from 'next/css'

export default () => <p className={style}>Hi there!</p>
const style = css({
  color: 'red',
  ':hover': {
    color: 'blue'
  },
  '@media (max-width: 500px)': {
    color: 'rebeccapurple'
  }
})

We think this model offers superior performance, composability and integration with the server-rendering pipeline. We cover this decision with more depth in the FAQ.
Automatic server rendering and code splitting 

Two tasks have so far been simultaneously very difficult and highly desirable:

Server rendering
Splitting your app's build into smaller bundles
With Next.js, every component inside pages/ gets server-rendered automatically and their scripts inlined.
When a component is loaded dynamically through <Link /> or the router, we fetch a JSON based representation of the page which likewise contains its scripts.
This means that a certain page could have an extensive list of imports:

import React from 'react'
import d3 from 'd3'
import jQuery from 'jquery'
… that don't affect the performance of the rest of the pages.

This detail is particularly powerful for large teams of people that collaborate on components with very different technical and business requirements.  The performance penalties incurred in by a team or individual won't affect the rest of the organization's.

Data fetching is up to the developer 

Server-rendering of static JSX is an important achievement, but real-world applications deal with dynamic data coming from different API calls and network requests.

Next.js makes a very important extension to the React's Component contract: getInitialProps.
A page that fetches some data would look as follows:

import React from 'react'
export class exports React.Component {
  static async getInitialProps () {
    const res = await fetch('https://api.company.com/user/123')
    const data = await res.json()
    return { username: data.profile.username }
  }
}

Our stance of what features we transpile (like async/await) can be summed up as: we target V8's capabilities. Since our goal is code-sharing between server and client, this gives us great performance when executing the code on Node and developing on Chrome or Brave, for example.

As you can see, the contract is very simple and unopinionated: getInitialProps must return a Promise that resolves to a `JavaScript` object, which then populates the component's props.
This makes Next.js play well with REST APIs, GraphQL and even global-state management libraries like Redux, an example of which you can find on our wiki.
The same method allows for different data to be loaded depending on whether the component is server-rendered or dynamically rendered through client-side routing:

static async getInitialProps ({ res }) {
  return res
    ? { userAgent: res.heders['user-agent'] }
    : { userAgent: navigator.userAgent }
}

Anticipation is the key to performance 

We think that the pendulum of "fully server-rendered" swung abruptly to the extreme of "single page app" / "nothing server-rendered" thanks to the ability to give the user immediate feedback despite the network, provided the entire app has been loaded.
For www.zeit.co we've implemented a technique on top of Next.js that brings us the best of both worlds: every single <Link /> tag pre-fetches the component's JSON representation on the background, via a ServiceWorker.
If you navigate around, odds are that by the time you follow a link or trigger a route transition, the component has already been fetched.

Furthermore, since the data is fetched by a dedicated method (getInitialProps), we can pre-fetch aggressively without triggering unnecessary server load or data fetching. This is a substantial benefit over naive web 1.0 preload strategies.
Simple deployment 

We created Next.js because we believe universal isomorphic applications are a big part of the future of the web.

Ahead-of-time bundling and compilation (anticipation) is a critical part of effective and performant deployment.

All it takes to deploy a Next.js app is to run next build followed by next start.
When using now, your package.json looks like this:

{
  "name": "my-app",
  "dependencies": {
    "next": "*"
  },
  "scripts": {
    "dev": "next",
    "build": "next build",
    "start": "next start"
  }
}

Then you can simply invoke now to deploy.
In closing, this is our contribution to this very interesting problem. We think it strikes a good balance between flexibility and smart defaults, but it's certainly not a solution to every problem.

We look forward to, in the coming weeks, discussing and featuring other great approaches to accomplish this mission, like Vue.JS, Gatsby, Ember+Fastboot and many others.

If you're interested in contributing, please join zeit.chat, check out our issues and explore and debate future directions.
