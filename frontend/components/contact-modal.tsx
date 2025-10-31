'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, X } from 'lucide-react';
import { contactService } from '@/services/contact.service';
import { toast } from 'sonner';

const contactSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  transactionRefId: z.string().optional(),
});

type ContactForm = z.infer<typeof contactSchema>;

export function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      title: '',
      message: '',
      transactionRefId: '',
    },
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      await contactService.createContact({
        title: data.title,
        message: data.message,
        transactionRefId: data.transactionRefId || undefined,
      });
      toast.success('Message sent successfully! We will get back to you soon.');
      form.reset();
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Contact Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

      {/* Contact Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Contact Support
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Subject</Label>
              <Input
                {...form.register('title')}
                placeholder="Brief description of your issue"
                className="mt-1"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="transactionRefId">Reference (Optional)</Label>
              <Input
                {...form.register('transactionRefId')}
                placeholder="Enter transaction Reference if related"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                {...form.register('message')}
                placeholder="Describe your issue in detail..."
                rows={4}
                className="mt-1"
              />
              {form.formState.errors.message && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.message.message}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}