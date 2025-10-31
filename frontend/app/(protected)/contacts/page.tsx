'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { contactService } from '@/services/contact.service';
import { DataTable } from '@/components/ui/data-table';
import { contactsColumns } from '@/components/tables/contacts-columns';
import { ContactFilters } from '@/components/filters/contact-filters';

export default function ContactsPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const { data: contactData, isLoading } = useQuery({
    queryKey: ['user-contacts'],
    queryFn: () => contactService.getUserContacts(1, 100),
  });
  
  const allContacts = contactData?.contacts || [];

  // Filter contacts based on status and date range
  const contacts = useMemo(() => {
    let filtered = allContacts;
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }
    
    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(c => new Date(c.createdAt) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(c => new Date(c.createdAt) <= new Date(endDate));
    }
    
    return filtered;
  }, [allContacts, statusFilter, startDate, endDate]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <DataTable
        title='My Support Requests'
        columns={contactsColumns}
        data={contacts}
        searchPlaceholder="Search support requests..."
        filters={
          <ContactFilters
            statusFilter={statusFilter}
            startDate={startDate}
            endDate={endDate}
            onStatusChange={setStatusFilter}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        }
      />
    </div>
  );
}