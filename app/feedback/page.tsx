import { FeedbackForm } from '@/components/feedback/feedback-form';

export default function FeedbackPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(90vh-80px)]">
      <div className="w-full max-w-xl">
        <FeedbackForm />
      </div>
    </div>
  );
}
