import type { AppMode } from '@/types/app'
import {getInstallId} from "@/service/common";

export const getRedirection = async (
    isCurrentWorkspaceEditor: boolean,
    app: { id: string, mode: AppMode },
    redirectionFunc: (href: string) => void,
) => {
    const res = await getInstallId({app_id: app.id})
    localStorage.setItem('install_id', res.installId)
    redirectionFunc(`/explore/installed/${res.installId}`)
}
