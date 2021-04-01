import { useEffect, useState } from 'react'

import { useUserState } from '../../context/user/UserStateProvider'
import { useFeedState } from '../../context/feed/FeedStateProvider'
import { feedActionTypes } from '../../context/feed/feedReducer'

import axios from '../../config/axios'

import { Post } from '../../helpers/components'
import { Spinner } from '../../helpers/svg'
import './Feed.css'

import formatDate from '../../utils/formatDate'

function Feed() {
  const { userState } = useUserState()
  const { feedState, setFeedState } = useFeedState()

  const [isLoading, setLoading] = useState(true)
  const [createPost, setCreatePost] = useState({ 
    category: 'None',
    content: '', 
    placeholder: 'Anything you\'d like to share?' 
  })

  useEffect(async () => {
    if (userState.user) {
      let res = await axios.get(`/api/feed/query?index=1&limit=4&user=${userState.user?._id}`)

      if (res.status === 200) {
        setFeedState({ type: feedActionTypes.INIT, posts: res.data.posts })
        setLoading(false)
      }
    }
  }, [])

  // Function to create post
  const handleCreatePost = async (e) => {
    e.preventDefault()

    let res = await axios.post('/api/feed/post/create', {
      category: createPost.category,
      author: userState.user._id,
      content: createPost.content
    })

    if (res.status === 201) {
      setFeedState({ 
        type: feedActionTypes.INIT, 
        posts: [
          ...feedState.posts, 
          {
            _id: res.data.post._id,
            category: createPost.category,
            author: { username: userState.user.username },
            content: createPost.content,
            countOfLikes: 0,
            countOfComments: 0,
            isLike: false,
            updatedAt: res.data.post.updatedAt
          } 
        ]
      })
    }

    setCreatePost({ category: 'None', content: '', placeholder: 'Anything you\'d like to share?' })
  }

  return (
    <section className='feed'>
      {isLoading ? <Spinner id='spin' className='spinner' /> : (
        <>
          {/* <--------------- Create Post Form ---------------> */}
          <form onSubmit={(e) => handleCreatePost(e)} className='feed__createPost'>
          <section className='profilePhoto'></section>
          
          <input 
            type='text' 
            name='content' 
            autoComplete='off'
            placeholder={createPost.placeholder}
            value={createPost.content} 
            onChange={(e) => setCreatePost({ ...createPost, [e.target.name]: e.target.value })}
            className='asd'
          />

          <button type='submit' disabled={!createPost.content}>Post</button>
        </form>

        {/* <--------------- Posts ---------------> */}
        <div className='feed__posts'>
          {feedState.posts?.map(({ _id, category, author, content, countOfLikes, countOfComments, isLike, updatedAt }) => (
            <Post 
              key={_id} 
              id={_id}
              category={category}
              author={author?.username}
              photoURL={author?.photoURL}
              content={content}
              countOfLikes={countOfLikes}
              countOfComments={countOfComments} 
              isLike={isLike}
              updatedAt={formatDate(new Date(updatedAt))}
            />
          ))}
        </div>
        </>
      )}
    </section>
  )
}

export default Feed
