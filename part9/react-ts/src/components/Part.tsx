import type { CoursePart } from '../types'

interface PartProps {
  part: CoursePart;
}

export default function Part({ part }: PartProps) {
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };
  
  switch (part.kind) {
    case "basic":
      return (
        <>
          <p><strong>{part.name} {part.exerciseCount}</strong></p>
          <p><i>{part.description}</i></p>
        </>
      )
    case "group":
      return (
        <>
          <p><strong>{part.name} {part.exerciseCount}</strong></p>
          <p>group exercises: {part.groupProjectCount}</p>
        </>
      )
    case "background":
      return (
        <>
          <p><strong>{part.name} {part.exerciseCount}</strong></p>
          <p><i>{part.description}</i></p>
          <p>background: {part.backgroundMaterial}</p>
        </>
      )
    default:
      return assertNever(part)
  }

}