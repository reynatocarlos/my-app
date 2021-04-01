import axios from '../../../config/axios'

import { useFeedState } from '../../../context/feed/FeedStateProvider'
import { feedActionTypes } from '../../../context/feed/feedReducer'

import './DeletePostModal.css'

function DeletePostModal({ id, author, postState, setPostState }) {
  const { feedState, setFeedState } = useFeedState()

  // Function to delete the post
  const handleDel = async () => {
    setFeedState({ 
      type: feedActionTypes.INIT, 
      posts: feedState.posts.filter(post => post._id !== id)
    })
    setPostState({ ...postState, isDelModalShow: false })
    
    await axios.delete(`/api/feed/post/${id}`, { data: { author }})
  }

  return (
    <div className='deletePostModal'>
      <div className='deletePostModal__container'>
        <header>
          <label className='deletePostModal__label'>Delete</label>
        </header>

        <section>
          <p>Are you sure you want to delete this post?</p>
        </section>

        <footer>
          <button 
            onClick={handleDel}
            className='deletePostModal__delBtn'
          >
            Delete
          </button>
          
          <button 
            onClick={() => setPostState({ ...postState, isDelModalShow: false })} 
            className='deletePostModal__cancelBtn'
          >
            Cancel
          </button>
        </footer>
      </div>
    </div>
  )
}

export default DeletePostModal
