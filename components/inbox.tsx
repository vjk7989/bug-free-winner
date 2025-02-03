"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Mail, Send, Paperclip, RefreshCw } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Email } from "@/lib/email-service"

export function Inbox() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const { toast } = useToast();
  const [newEmail, setNewEmail] = useState({
    to: '',
    subject: '',
    body: '',
    attachments: [] as File[],
  });

  const fetchEmails = async () => {
    try {
      setIsLoading(true);
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "User email not found",
        });
        return;
      }

      const response = await fetch(`/api/emails?email=${userEmail}`);
      if (!response.ok) throw new Error('Failed to fetch emails');
      
      const data = await response.json();
      setEmails(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch emails",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmail),
      });

      if (!response.ok) throw new Error('Failed to send email');

      toast({
        title: "Success",
        description: "Email sent successfully",
      });
      setIsComposeOpen(false);
      setNewEmail({ to: '', subject: '', body: '', attachments: [] });
      fetchEmails();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send email",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Inbox</CardTitle>
          <div className="flex gap-2">
            <Button onClick={() => setIsComposeOpen(true)}>
              <Mail className="h-4 w-4 mr-2" />
              Compose
            </Button>
            <Button variant="outline" onClick={fetchEmails} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {emails.map((email) => (
            <div
              key={email.id}
              className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                !email.read ? 'bg-blue-50' : ''
              }`}
              onClick={() => setSelectedEmail(email)}
            >
              <div className="flex justify-between">
                <div className="font-medium">{email.from}</div>
                <div className="text-sm text-gray-500">
                  {formatDate(email.date.toString(), 'MMM d, h:mm a')}
                </div>
              </div>
              <div className="font-medium">{email.subject}</div>
              <div className="text-sm text-gray-500 truncate">{email.body}</div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Compose Email Dialog */}
      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compose Email</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSendEmail} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="To"
                value={newEmail.to}
                onChange={(e) => setNewEmail({ ...newEmail, to: e.target.value })}
              />
              <Input
                placeholder="Subject"
                value={newEmail.subject}
                onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
              />
              <Textarea
                placeholder="Message"
                value={newEmail.body}
                onChange={(e) => setNewEmail({ ...newEmail, body: e.target.value })}
                rows={6}
              />
              <Input
                type="file"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setNewEmail({ ...newEmail, attachments: files });
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="submit">
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Email Dialog */}
      <Dialog open={!!selectedEmail} onOpenChange={() => setSelectedEmail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEmail?.subject}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <div className="font-medium">From: {selectedEmail?.from}</div>
              <div className="text-sm text-gray-500">
                {selectedEmail?.date && formatDate(selectedEmail.date.toString(), 'MMM d, yyyy h:mm a')}
              </div>
            </div>
            <div className="whitespace-pre-wrap">{selectedEmail?.body}</div>
            {selectedEmail?.attachments.length > 0 && (
              <div className="space-y-2">
                <div className="font-medium">Attachments:</div>
                {selectedEmail.attachments.map((att, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Paperclip className="h-4 w-4" />
                    <a
                      href={URL.createObjectURL(new Blob([att.content]))}
                      download={att.filename}
                      className="text-blue-500 hover:underline"
                    >
                      {att.filename}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 