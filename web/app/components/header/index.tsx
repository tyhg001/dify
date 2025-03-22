'use client'
import { useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useBoolean } from 'ahooks'
import { useSelectedLayoutSegment } from 'next/navigation'
import { Bars3Icon } from '@heroicons/react/20/solid'
import AccountDropdown from './account-dropdown'
import AppNav from './app-nav'
import ExploreNav from './explore-nav'
import { useAppContext } from '@/context/app-context'
import LogoSite from '@/app/components/base/logo/logo-site'
import useBreakpoints, { MediaType } from '@/hooks/use-breakpoints'
import { useProviderContext } from '@/context/provider-context'
import { useModalContext } from '@/context/modal-context'
import { Plan } from '../billing/type'

const navClassName = `
  flex items-center relative mr-0 sm:mr-3 px-3 h-8 rounded-xl
  font-medium text-sm
  cursor-pointer
`

const Header = () => {
  const { isCurrentWorkspaceEditor, isCurrentWorkspaceDatasetOperator } = useAppContext()
  const selectedSegment = useSelectedLayoutSegment()
  const media = useBreakpoints()
  const isMobile = media === MediaType.mobile
  const [isShowNavMenu, { toggle, setFalse: hideNavMenu }] = useBoolean(false)
  const { enableBilling, plan } = useProviderContext()
  const { setShowPricingModal, setShowAccountSettingModal } = useModalContext()
  const isFreePlan = plan.type === Plan.sandbox
  const handlePlanClick = useCallback(() => {
    if (isFreePlan)
      setShowPricingModal()
    else
      setShowAccountSettingModal({ payload: 'billing' })
  }, [isFreePlan, setShowAccountSettingModal, setShowPricingModal])

  useEffect(() => {
    hideNavMenu()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSegment])
  return (
    <div className='flex items-center justify-between flex-1 px-4 bg-background-body'>
      <div className='flex items-center'>
        {isMobile && <div
          className='flex items-center justify-center w-8 h-8 cursor-pointer'
          onClick={toggle}
        >
          <Bars3Icon className="w-4 h-4 text-gray-500" />
        </div>}
        {
          !isMobile
          && <div className='flex w-64 shrink-0 items-center gap-1.5 self-stretch p-2 pl-3'>
            <Link href="/apps" className='flex items-center justify-center w-8 h-8 gap-2 shrink-0'>
              <LogoSite className='object-contain' />
            </Link>
            <div className='font-light text-divider-deep'>/</div>
            <div className='flex items-center gap-0.5'>
            </div>
          </div>
        }
      </div >
      {isMobile && (
        <div className='flex'>
          <Link href="/apps" className='flex items-center mr-4'>
            <LogoSite />
          </Link>
          <div className='font-light text-divider-deep'>/</div>
        </div >
      )}
      {
        !isMobile && (
          <div className='flex items-center'>
            <AppNav />
             <ExploreNav className={navClassName} />
          </div>
        )
      }
      <div className='flex items-center shrink-0'>
        <AccountDropdown isMobile={isMobile} />
      </div>
      {
        (isMobile && isShowNavMenu) && (
          <div className='flex flex-col w-full p-2 gap-y-1'>
            {!isCurrentWorkspaceDatasetOperator && <AppNav />}
            {!isCurrentWorkspaceDatasetOperator && <ExploreNav className={navClassName} />}
          </div>
        )
      }
    </div >
  )
}
export default Header
