'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import {
  RiPlanetFill,
  RiPlanetLine,
} from '@remixicon/react'
import classNames from '@/utils/classnames'
type ExploreNavProps = {
  className?: string
}

const ExploreNav = ({
  className,
}: ExploreNavProps) => {
  const { t } = useTranslation()
  const selectedSegment = useSelectedLayoutSegment()
  const activated = selectedSegment === 'explore'
//fixme 些处的id是写死的，后面需要修改
  const installId=localStorage.getItem('install_id') ?? '655b9a35-887e-4dd4-b385-d7763ef25a05';
  return (
    <Link href={`/explore/installed/${installId}`} className={classNames(
      className, 'group',
      activated && 'bg-components-main-nav-nav-button-bg-active shadow-md',
      activated ? 'text-components-main-nav-nav-button-text-active' : 'text-components-main-nav-nav-button-text hover:bg-components-main-nav-nav-button-bg-hover',
    )}>
      {
        activated
          ? <RiPlanetFill className='mr-2 w-4 h-4' />
          : <RiPlanetLine className='mr-2 w-4 h-4' />
      }
      {t('common.menus.explore')}
    </Link>
  )
}

export default ExploreNav
