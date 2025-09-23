type CoursePart = {
  name: string,
  exerciseCount: number
}

interface ContentProps {
  courseParts: CoursePart[] 
}

export default function Content({ courseParts }: ContentProps) {
  return (
    <div>
      {courseParts.map(part => (
        <p key={part.name}>
          {part.name} {part.exerciseCount}
        </p>
      ))}
    </div>
  )
}