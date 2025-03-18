import {fetchFilePreview, getInstallId, getPayUrl} from "@/service/common";
export const getRedirection = async (
  isCurrentWorkspaceEditor: boolean,
  app: any,
  redirectionFunc: (href: string) => void,
) => {
    //直接跳转对应的智能体问答
    try {
        const res = await getInstallId({ app_id:app.id })
        localStorage.setItem('install_id', res.installId)
        redirectionFunc(`/explore/installed/${res.installId}`)
    }
    catch { }
}
