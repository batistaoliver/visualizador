declare module '*.scss' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames
  export = classNames
}

type Cloud = {
  id: string
  name: string
  url: string
}

type Nullable<T> = T | null
