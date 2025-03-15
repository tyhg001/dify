export const getRedirection = (
  isCurrentWorkspaceEditor: boolean,
  app: any,
  redirectionFunc: (href: string) => void,
) => {
    //fixme 此处要调整两个对应的id不一至
    redirectionFunc(`/explore/installed/${app.id}`)
}
