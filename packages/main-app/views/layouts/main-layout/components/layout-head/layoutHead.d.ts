interface IDropdownListItem {
  title: string
  command: string
}

export interface IDropdownList {
  [index: number]: IDropdownListItem
}

interface IHeadMenuItem {
  name: string
  type: string
  url: string
}

export interface IHeadMenu {
  [index: number]: IHeadMenuItem
}
