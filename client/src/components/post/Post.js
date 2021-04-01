import { useEffect, useRef, useState } from 'react'
import { useUserState } from '../../context/user/UserStateProvider'
import axios from '../../config/axios'

import { DeletePostModal } from '../../helpers/components'
import { CommentIcon, EditIcon, HeartIcon, MoreIcon, StarIcon, TrashIcon  } from '../../helpers/icons'
import './Post.css'

import { handleDropdown, keyExit, outsideClick } from '../../utils/handleDropdown'
import truncate from '../../utils/truncate'

function Post({ id, category, author, photoURL, content, countOfLikes, countOfComments, isLike, updatedAt}) {
  const { userState } = useUserState()
  const [postState, setPostState] = useState({
    postContent: truncate(content, 220),
    isContentExpand: false,
    isEditPost: false,
    isDelModalShow: false,
    isPostLikeModalShow: false,
    likeState: isLike,
    likesCount: countOfLikes
  })
  const dropdownBtnRef = useRef()

  // Function to edit the post
  const handleEditPost = async (e) => {
    setPostState({ ...postState, postContent: e.target.value, isEditPost: false })
    
    await axios.put(`/api/feed/post/${id}`, { category, content: e.target.value })
  }
  
  // Function to get post's likes
  const handleGetPostLike = async () => {
    let res = await axios.get(`/api/feed/post/${id}/like`)
    console.log('Here are the users who liked the post -->', res.data.postLike.whoLike.username)
  }

  // Function to like the post
  const handleLikePost = async () => {
    if (!postState.likeState) {
      setPostState({ ...postState, likeState: true, likesCount: postState.likesCount + 1 })
    } else {
      setPostState({ ...postState, likeState: false, likesCount: postState.likesCount - 1 })
    }

    userState.user && await axios.post(`/api/feed/post/${id}/like`, { whoLike: userState.user?._id })
  }

  // Function to handle expand button state
  const handleExpandBtnState = () => {
    if (postState.isContentExpand) {
      setPostState({ ...postState, postContent: truncate(content, 220), isContentExpand: false })
    } else {
      setPostState({ ...postState, postContent: content, isContentExpand: true })
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', (e) => keyExit(e, '.post__dropdownContent'))
    // window.addEventListener('mouseup', (e) => outsideClick(e, dropdownBtnRef, 'post__dropdownContent'))
    
    return () => {
      window.removeEventListener('keydown', keyExit)
      window.removeEventListener('mouseup', outsideClick)
    }
  })

  return (
    <div className='post'>
      {postState.isDelModalShow 
        && 
      <DeletePostModal 
        id={id} 
        author={userState.user._id} 
        postState={postState}
        setPostState={setPostState} 
      />}

      {/* <--------------- Header ---------------> */}
      <section className='post__header'>
        <div className='post__headerInfo'>
          <section className='post__profilePhoto profilePhoto'></section>

          <div>
            <h3 className='post__author'>{author}</h3>
            <p className='post__timestamps'>{updatedAt}</p>
          </div>
        </div>

        {/* <--------------- Dropdown ---------------> */}
        <div className='post__dropdown'>
          <MoreIcon 
            ref={dropdownBtnRef}
            onClick={() => !postState.isEditPost && handleDropdown(`#_${id}`)}
            className='icon-btn' 
          />

          <ul id={`_${id}`} className='post__dropdownContent'>
            {userState.user.username === author && (
              <>
                <li onClick={() => {
                  if (postState.isEditPost) {
                    setPostState({ ...postState, isEditPost: false })
                  } else {
                    handleDropdown(`#_${id}`)
                    setPostState({ ...postState, isEditPost: true })
                  }
                }}>
                  <EditIcon className='icon' />
                  <p>Edit</p>
                </li>

                <li onClick={() => {
                  handleDropdown(`#_${id}`)
                  setPostState({ ...postState, isDelModalShow: true })
                }}>
                  <TrashIcon className='icon' />
                  <p>Delete</p>
                </li>
              </>
            )}
          </ul>
        </div>
      </section>

      {/* <--------------- Body ---------------> */}
      <section className='post__body'>
        {postState.isEditPost ? (
          <textarea 
            autoFocus
            defaultValue={postState.postContent}
            onKeyDown={(e) => e.keyCode == 13 && handleEditPost(e)} 
            className={`${postState.postContent.length < 50 && 'post__input--large'} .post__input--large post__input`}
          />
        ) : (
          <p className={`${postState.postContent.length < 50 && 'post__content--large'} post__content`}>
            {postState.postContent}
            {postState.postContent?.length > 220 
              && 
            <span onClick={handleExpandBtnState}>
              {!postState.isContentExpand ? ' Show More' : ' Show Less'}
            </span>}
          </p>
        )}

        <div className='post__bodyInfo'>
          <p onClick={handleGetPostLike}>
            <span>{postState.likesCount}</span>
            {postState.likesCount > 1 ?  ' likes' : ' like'}
          </p>

          <p>
            <span>{postState.countOfComments}</span>
            {postState.countOfComments > 1 ? ' comments' : ' comment'}
          </p>
        </div>

        <p className='post__bodyInfo'></p>
      </section>

      {/* <--------------- Footer ---------------> */}
      <section className='post__footer'>
        <HeartIcon 
          onClick={handleLikePost}
          className={`${postState.likeState && 'liked'} react-btn icon-btn`} 
        />
        <StarIcon 
          className='react-btn icon-btn' 
        />
        <CommentIcon 
          className='icon-btn' 
        />
      </section>
    </div>
  )
}

export default Post