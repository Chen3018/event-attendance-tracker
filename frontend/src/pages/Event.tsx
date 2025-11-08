import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { columns } from '@/components/guests/columns'
import type { EventDetails } from '@/lib/types'
import { DataTable } from '@/components/guests/data-table'

import { useApi } from '@/hooks/api'

export default function Event() {
  const { apiFetch } = useApi();

  const { id } = useParams<{ id: string }>()
  const [event, setEvent] = useState<EventDetails | null>(null)

  function getList(id: string): Promise<EventDetails> {
    return apiFetch(`/event/${id}`)
  }

  useEffect(() => {
    if (id) {
      getList(id).then(setEvent)
    }
  }, [id])

  return (
    <div className="max-w-[95rem] mx-auto pt-8">
      <h2 className="flex text-3xl font-semibold pb-5">{event?.name}</h2>

      <DataTable columns={columns} data={event?.guestList || []} />
    </div>
  )
}