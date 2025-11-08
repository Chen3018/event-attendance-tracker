import type { ColumnDef } from "@tanstack/react-table"
import { Check, MoreHorizontal, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { GuestListItem } from "@/lib/types"

export const columns: ColumnDef<GuestListItem>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => (<div className="text-left">{row.getValue("name")}</div>),
    },
    {
        accessorKey: "invitedBy",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Invited By
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => (<div className="text-left">{row.getValue("invitedBy")}</div>),
    },
    {
        accessorKey: "checkedIn",
        header: () => <div className="text-center">Checked In</div>,
        cell: ({ row }) => (row.getValue("checkedIn") ? <div className="flex justify-center"><Check /></div> : <span></span>),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const guest = row.original
        
            return (
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem variant="destructive" onClick={() => {}}>Remove Guest</DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }
]