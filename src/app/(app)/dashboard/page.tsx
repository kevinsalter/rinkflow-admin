'use client'

import { Stat } from '@/app/stat'
import { Avatar } from '@/components/avatar'
import { Heading, Subheading } from '@/components/heading'
import { Select } from '@/components/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [orders, setOrders] = useState<Array<{
    id: string
    date: string
    customer: { name: string }
    event: { name: string; thumbUrl: string }
    amount: { usd: string }
    url: string
  }>>([])
  
  useEffect(() => {
    // Simulate fetching orders data
    setOrders([
      { id: '3000', date: 'January 6, 2025', customer: { name: 'Sarah Johnson' }, event: { name: 'Winter Classic Tournament', thumbUrl: '/teams/catalyst.svg' }, amount: { usd: '$525.00' }, url: '/orders/3000' },
      { id: '3001', date: 'January 6, 2025', customer: { name: 'Mike Chen' }, event: { name: 'Skills Development Camp', thumbUrl: '/teams/catalyst.svg' }, amount: { usd: '$275.00' }, url: '/orders/3001' },
      { id: '3002', date: 'January 5, 2025', customer: { name: 'Emily Davis' }, event: { name: 'U16 Season Pass', thumbUrl: '/teams/catalyst.svg' }, amount: { usd: '$850.00' }, url: '/orders/3002' },
      { id: '3003', date: 'January 5, 2025', customer: { name: 'Tom Wilson' }, event: { name: 'Goalie Training Session', thumbUrl: '/teams/catalyst.svg' }, amount: { usd: '$125.00' }, url: '/orders/3003' },
      { id: '3004', date: 'January 4, 2025', customer: { name: 'Lisa Anderson' }, event: { name: 'Spring League Registration', thumbUrl: '/teams/catalyst.svg' }, amount: { usd: '$650.00' }, url: '/orders/3004' },
    ])
  }, [])

  return (
    <div>
      <Heading>Hockey Operations Dashboard</Heading>
      <div className="mt-8 flex items-end justify-between">
        <Subheading>Overview</Subheading>
        <div>
          <Select name="period">
            <option value="last_week">Last week</option>
            <option value="last_two">Last two weeks</option>
            <option value="last_month">Last month</option>
            <option value="last_quarter">Last quarter</option>
          </Select>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="mt-4 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        <Stat title="Total revenue" value="$2.6M" change="+4.5%" />
        <Stat title="Active players" value="699" change="+12.3%" />
        <Stat title="Registered teams" value="24" change="+2" />
        <Stat title="Ice hours utilized" value="1,847" change="+8.7%" />
      </div>

      {/* Recent Orders Table */}
      <Subheading className="mt-14">Recent registrations</Subheading>
      <Table className="mt-4 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Order number</TableHeader>
            <TableHeader>Registration date</TableHeader>
            <TableHeader>Customer</TableHeader>
            <TableHeader>Program</TableHeader>
            <TableHeader className="text-right">Amount</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} href={order.url} title={`Order #${order.id}`}>
              <TableCell>{order.id}</TableCell>
              <TableCell className="text-zinc-500">{order.date}</TableCell>
              <TableCell>{order.customer.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar src={order.event.thumbUrl} className="size-6" />
                  <span>{order.event.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">{order.amount.usd}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}