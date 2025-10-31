'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, User, Calendar, Reply } from 'lucide-react';
import { format } from 'date-fns';

interface ContactViewModalProps {
  contact: any;
  open: boolean;
  onClose: () => void;
  onReply: (reply: string) => void;
  isReplying: boolean;
}

export function ContactViewModal({ contact, open, onClose, onReply, isReplying }: ContactViewModalProps) {
  const [replyMessage, setReplyMessage] = useState('');

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'destructive';
      case 'IN_PROGRESS': return 'default';
      case 'RESOLVED': return 'secondary';
      case 'CLOSED': return 'outline';
      default: return 'secondary';
    }
  };

  const handleReply = () => {
    if (replyMessage.trim()) {
      onReply(replyMessage);
      setReplyMessage('');
    }
  };

  if (!contact) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Contact Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Subject</label>
              <p className="font-semibold">{contact.title}</p>
            </div>
            <div className='flex flex-col gap-2 '>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <Badge className='w-fit' variant={getStatusColor(contact.status)}>
                {formatStatus(contact.status)}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Customer</label>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium">{contact.user.firstName} {contact.user.lastName}</p>
                  <p className="text-sm text-gray-500">{contact.user.email}</p>
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Date Created</label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <p>{format(new Date(contact.createdAt), 'PPP')}</p>
              </div>
            </div>
          </div>

          {/* Original Message */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">Original Message</label>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{contact.message}</p>
            </div>
          </div>

          {/* Replies */}
          {contact.replies && contact.replies.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-600 mb-3 block">Conversation</label>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {contact.replies.map((reply: any, index: number) => (
                  <div key={reply.id} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          {reply.user.firstName} {reply.user.lastName}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {reply.user.role}
                        </Badge>
                      </div>
                      <span className="text-xs text-blue-600">
                        {format(new Date(reply.createdAt), 'PPp')}
                      </span>
                    </div>
                    <p className="text-blue-800">{reply.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reply Section */}
          {contact.status !== 'RESOLVED' && contact.status !== 'CLOSED' && (
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Send Reply</label>
              <div className="space-y-3">
                <Textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={4}
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                  <Button 
                    onClick={handleReply}
                    disabled={isReplying || !replyMessage.trim()}
                  >
                    <Reply className="h-4 w-4 mr-2" />
                    {isReplying ? 'Sending...' : 'Send Reply'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Close button for resolved/closed contacts */}
          {(contact.status === 'RESOLVED' || contact.status === 'CLOSED') && (
            <div className="flex justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}