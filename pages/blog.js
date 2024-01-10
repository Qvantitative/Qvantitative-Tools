import React, { useState, useEffect } from 'react'

const Blog = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@qvantitative')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.items)
      })
  }, [])

  return (
    <div>
      <h1>Latest posts from Medium</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.guid}>
            <a href={post.link} target="_blank" rel="noopener noreferrer">
              {post.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Blog