'use client'
import { useTranslation } from 'react-i18next'
import { Fragment, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useContext, useContextSelector } from 'use-context-selector'
import { RiAccountCircleLine, RiArrowDownSLine, RiArrowRightUpLine, RiBookOpenLine, RiGithubLine, RiInformation2Line, RiLogoutBoxRLine, RiMap2Line, RiSettings3Line, RiStarLine } from '@remixicon/react'
import Link from 'next/link'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import Indicator from '../indicator'
import AccountAbout from '../account-about'
import GithubStar from '../github-star'
import Support from './support'
import Compliance from './compliance'
import classNames from '@/utils/classnames'
import I18n from '@/context/i18n'
import Avatar from '@/app/components/base/avatar'
import { logout } from '@/service/common'
import AppContext, { useAppContext } from '@/context/app-context'
import { useModalContext } from '@/context/modal-context'
import { LanguagesSupported } from '@/i18n/language'
import { LicenseStatus } from '@/types/feature'
import { IS_CLOUD_EDITION } from '@/config'

export type IAppSelector = {
  isMobile: boolean
}

export default function AppSelector({ isMobile }: IAppSelector) {
  const itemClassName = `
    flex items-center w-full h-9 pl-3 pr-2 text-text-secondary system-md-regular
    rounded-lg hover:bg-state-base-hover cursor-pointer gap-1
  `
  const router = useRouter()
  const [aboutVisible, setAboutVisible] = useState(false)
  const systemFeatures = useContextSelector(AppContext, v => v.systemFeatures)

  const { locale } = useContext(I18n)
  const { t } = useTranslation()
  const { userProfile, langeniusVersionInfo, isCurrentWorkspaceOwner } = useAppContext()
  const { setShowAccountSettingModal } = useModalContext()

  const handleLogout = async () => {
    await logout({
      url: '/logout',
      params: {},
    })

    localStorage.removeItem('setup_status')
    localStorage.removeItem('console_token')
    localStorage.removeItem('refresh_token')

    router.push('/signin')
  }

  return (
    <div className="">
      <Menu as="div" className="relative inline-block text-left">
        {
          ({ open }) => (
            <>
              <MenuButton
                className={`
                    inline-flex items-center
                    rounded-[20px] py-1 pl-1 pr-2.5 text-sm
                  text-text-secondary hover:bg-state-base-hover
                    mobile:px-1
                    ${open && 'bg-state-base-hover'}
                  `}
              >
                <Avatar avatar={userProfile.avatar_url} name={userProfile.name} className='mr-0 sm:mr-2' size={32} />
                {!isMobile && <>
                  {userProfile.name}
                  <RiArrowDownSLine className="w-3 h-3 ml-1 text-text-tertiary" />
                </>}
              </MenuButton>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <MenuItems
                  className="
                    absolute right-0 mt-1.5 w-60 max-w-80
                    origin-top-right divide-y divide-divider-subtle rounded-lg bg-components-panel-bg-blur
                    shadow-lg focus:outline-none
                  "
                >
                  <MenuItem disabled>
                    <div className='flex flex-nowrap items-center py-[13px] pl-3 pr-2'>
                      <div className='grow'>
                        <div className='break-all system-md-medium text-text-primary'>{userProfile.name}</div>
                      </div>
                      <Avatar avatar={userProfile.avatar_url} name={userProfile.name} size={36} className='mr-3' />
                    </div>
                  </MenuItem>
                  <div className="px-1 py-1">
                    <MenuItem>
                      <Link
                        className={classNames(itemClassName, 'group',
                          'data-[active]:bg-state-base-hover',
                        )}
                        href='/account'
                        target='_self' rel='noopener noreferrer'>
                        <RiAccountCircleLine className='size-4 shrink-0 text-text-tertiary' />
                        <div className='px-1 system-md-regular grow text-text-secondary'>{t('common.account.account')}</div>
                        <RiArrowRightUpLine className='size-[14px] shrink-0 text-text-tertiary' />
                      </Link>}
                    </Menu.Item>
                  </div>
                  <MenuItem>
                    <div className='p-1' onClick={() => handleLogout()}>
                      <div
                        className={classNames(itemClassName, 'group justify-between',
                          'data-[active]:bg-state-base-hover',
                        )}
                      >
                        <RiLogoutBoxRLine className='size-4 shrink-0 text-text-tertiary' />
                        <div className='px-1 system-md-regular grow text-text-secondary'>{t('common.userProfile.logout')}</div>
                      </div>
                    </div>
                  </MenuItem>
                </MenuItems>
              </Transition>
            </>
          )
        }
      </Menu>
      {
        aboutVisible && <AccountAbout onCancel={() => setAboutVisible(false)} langeniusVersionInfo={langeniusVersionInfo} />
      }
    </div >
  )
}
