interface HeaderProps {
  courseName: string
}

export default function Header({ courseName }: HeaderProps) {
  return (
    <h1>{courseName}</h1>
  )
}