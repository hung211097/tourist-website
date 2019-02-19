import Link from 'next/link'
import Layout from '../components/layout.js'
import fetch from 'isomorphic-unfetch'
import styles from './index.scss'

function getPosts () {
  return [
    { id: 'hello-nextjs', title: 'Hello Next.js'},
    { id: 'learn-nextjs', title: 'Learn Next.js is awesome'},
    { id: 'deploy-nextjs', title: 'Deploy apps with ZEIT'},
  ]
}

const PostLink = ({ post }) => (
  <li>
    <Link href={`/post?id=${post.id}`}>
      <a>{post.name}</a>
    </Link>
    <style jsx>{`
      li {
        list-style: none;
        margin: 5px 0;
      }

      a {
        text-decoration: none;
        color: blue;
        font-family: "Arial";
      }

      a:hover {
        opacity: 0.6;
      }
    `}</style>
  </li>
)

const Index = (props) => (
  <Layout>
    <style jsx>{styles}</style>
     <h1 className="d-none">My Blog</h1>
     <ul>
       {props.shows.map((post) => (
         <PostLink key={post.show.id} post={post.show}/>
       ))}
     </ul>
   </Layout>
)

Index.getInitialProps = async function() {
  const res = await fetch('https://api.tvmaze.com/search/shows?q=batman')
  const data = await res.json()

  console.log(`Show data fetched. Count: ${data.length}`)
  return {
    shows: data
  }
}

export default Index
