import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { columns } from '@/components/guests/columns'
import type { Guest } from '@/components/guests/columns'
import { DataTable } from '@/components/guests/data-table'

function getList(id: string): Promise<Guest[]> {
  return Promise.resolve([
    { id: '1', name: 'John Doe', invitedBy: 'Alice', checkedIn: true },
    { id: '2', name: 'Jane Smith', invitedBy: 'Bob', checkedIn: false },
    { id: '3', name: 'Michael Johnson', invitedBy: 'Charlie', checkedIn: true },
    { id: '4', name: 'Emily Davis', invitedBy: 'David', checkedIn: false },
    { id: '5', name: 'William Brown', invitedBy: 'Eve', checkedIn: true },
    { id: '6', name: 'Olivia Wilson', invitedBy: 'Frank', checkedIn: false },
    { id: '7', name: 'James Taylor', invitedBy: 'Grace', checkedIn: true },
    { id: '8', name: 'Sophia Anderson', invitedBy: 'Hank', checkedIn: false },
    { id: '9', name: 'Benjamin Thomas', invitedBy: 'Ivy', checkedIn: true },
    { id: '10', name: 'Isabella Jackson', invitedBy: 'Jack', checkedIn: false },
    { id: '11', name: 'Lucas White', invitedBy: 'Karen', checkedIn: true },
  ])
}

export default function Event() {
  const { id } = useParams<{ id: string }>()
  const [guests, setGuests] = useState<Guest[]>([])

  const event = { id: id, title: "Sample Event", date: "2023-10-01", invited: 100, checkedIn: 75 }
  useEffect(() => {
    if (id) {
      getList(id).then(setGuests)
    }
  }, [id])

  return (
    <div className="max-w-[95rem] mx-auto pt-8">
      <h2 className="flex text-3xl font-semibold pb-5">{event.title}</h2>

      <DataTable columns={columns} data={guests} />
    </div>
  )
}