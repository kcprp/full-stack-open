const Header = ({ course }) => <h1>{course.name}</h1>

const Total = ({ sum }) => <p><b>total of {sum} exercises</b></p>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => 
  <div>
    {parts.map(part => 
      <Part key={part.id} part={part} />
      )}
  </div>

const Course = ({ course }) => {
  
  const sum = course.parts.reduce((total, part) => total + part.exercises, 0);
  
  return (
    <>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total sum={sum} />
    </>
  )
}

export default Course