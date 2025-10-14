import { useParams } from 'react-router-dom'

export default function Event() {
  const { id } = useParams<{ id: string }>()

  return (
      <h1>Event placeholder for event ID: {id}</h1>
  )
}