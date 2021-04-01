import { useEffect, useRef } from 'react'
import { createBrowserHistory } from 'history'
import { BrandLogo } from '../../helpers/svg'
import { 
          AccountIcon,
          FilterIcon, 
          HomeIcon,
          LogOutIcon,
          MessageIcon, 
          NotificationIcon,
      } from '../../helpers/icons'
import './Navigation.css'

import { handleDropdown, keyExit, outsideClick } from '../../utils/handleDropdown'
import scrollTop from '../../utils/scrollTop'

function Navigation() {
  const history = createBrowserHistory()
  const dropdownBtnRef = useRef()

  // Function to log out the user
  const handleLogOut = () => {
    localStorage.removeItem('user')
    history.push('/')
    window.location.reload()
  }

  useEffect(() => {
    window.addEventListener('keydown', (e) => keyExit(e, '.account__dropdownContent'))
    window.addEventListener('mouseup', (e) => outsideClick(e, dropdownBtnRef, 'account__dropdownContent'))
    
    return () => {
      window.removeEventListener('keydown', keyExit)
      window.removeEventListener('mouseup', outsideClick)
    }
  })
  
  return (
    <nav className='navigation'>
      {/* <--------------- Navigation Brand Logo & Filter Button ---------------> */}
      <div>
        <BrandLogo className='navigation__brandLogo brand-logo' />
        <FilterIcon className='navigation__filterBtn icon-btn' />
      </div>

      {/* <--------------- Navigation Page Title ---------------> */}
      <label className='navigation__pageLabel'>Feed</label>

      {/* <--------------- Navigation Buttons ---------------> */}
      <div className='navigation__btns'>
        <HomeIcon 
          onClick={scrollTop} 
          className='icon-btn' 
        />
        <MessageIcon 
          className='icon-btn' 
        />
        <NotificationIcon 
          className='icon-btn' 
        />

        <div className='navigation__accountDropdown'>
          <AccountIcon 
            ref={dropdownBtnRef}
            onClick={() => handleDropdown('.account__dropdownContent')}
            className='icon-btn' 
          />
          <ul className='account__dropdownContent'>
            <li>
              <AccountIcon className='icon' />
              <p>Profile</p>
            </li>
            <li onClick={handleLogOut} >
              <LogOutIcon className='icon' />
              <p>Log Out</p>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
