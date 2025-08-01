'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { SendIcon, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Input } from '../ui/input';

const FeedbackSchema = z.object({
  rating: z.enum(['😡', '😐', '😊', '😍'], {
    required_error: 'Silakan pilih salah satu ekspresi',
  }),
  wouldRecommend: z.enum(['yes', 'no'], {
    required_error: 'Silakan pilih jawaban',
  }),
  suggestion: z
    .string()
    .max(500, {
      message: 'Maksimum 500 karakter',
    })
    .optional(),
  name: z.string().max(100, { message: 'Maksimum 100 karakter' }).optional(),
});

type FeedbackValues = z.infer<typeof FeedbackSchema>;
type Step = 1 | 2 | 3 | 'done';

const EMOJIS: { emoji: FeedbackValues['rating']; label: string }[] = [
  { emoji: '😡', label: 'Tidak puas' },
  { emoji: '😐', label: 'Biasa saja' },
  { emoji: '😊', label: 'Puas' },
  { emoji: '😍', label: 'Sangat puas' },
];

export function FeedbackForm() {
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState<FeedbackValues | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const form = useForm<FeedbackValues>({
    resolver: zodResolver(FeedbackSchema),
    defaultValues: {
      rating: undefined,
      wouldRecommend: undefined,
      suggestion: '',
      name: '',
    },
  });

  const next = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setStep((s) => (s === 1 ? 2 : s === 2 ? 3 : 'done'));
      setIsTransitioning(false);
    }, 250);
  };

  const prev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setStep((s) => (s === 3 ? 2 : s === 2 ? 1 : s));
      setIsTransitioning(false);
    }, 250);
  };

  const onSubmit = (values: FeedbackValues) => {
    if (values.rating === '😊' || values.rating === '😍') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        disableForReducedMotion: true,
        colors: ['#8C6239', '#A97E53', '#fffacc'],
      });
    }
    setSubmitted(values);
    setStep('done');
  };

  if (step === 'done') {
    const rating = submitted?.rating ?? '😊';
    const name = submitted?.name?.trim();
    const THANKS_COPY: Record<FeedbackValues['rating'], string> = {
      '😍': `Senang banget kamu puas dengan Zewu! Sampai jumpa lagi ✨`,
      '😊': `Sampai ketemu lagi di Zewu ya! 😄`,
      '😐': `Kami akan terus meningkatkan pelayanan kami 🙏`,
      '😡': `Maaf atas ketidaknyamanannya. Masukanmu sangat berarti bagi kami 🙏`,
    };

    return (
      <div className="text-center space-y-3 py-10 max-w-md mx-auto px-6">
        <h2 className="text-2xl font-semibold">
          {name ? `Terima kasih, ${name}!` : 'Terima kasih!'}
        </h2>
        <p className="text-base text-muted-foreground">{THANKS_COPY[rating]}</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-md mx-auto px-6 py-8"
      >
        <div className="text-sm text-center text-muted-foreground mb-4">
          Langkah {step} dari 3
        </div>

        <div className="relative min-h-[320px]">
          <AnimatePresence mode="wait" initial={false}>
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl font-semibold text-center block mb-6">
                        Seberapa puas dengan kunjunganmu ke{' '}
                        <span
                          className="px-1 rounded-sm font-bold"
                          style={{
                            backgroundColor: 'rgba(140, 98, 57, 0.15)',
                            color: '#8C6239',
                          }}
                        >
                          Zewu
                        </span>{' '}
                        hari ini?
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-4 gap-3 justify-center">
                          {EMOJIS.map(({ emoji, label }) => (
                            <button
                              key={emoji}
                              type="button"
                              aria-label={label}
                              className={cn(
                                'p-3 flex flex-col items-center transition-all rounded-xl min-w-[64px] hover:scale-110 focus:outline-none',
                                field.value === emoji
                                  ? 'bg-[rgba(140,98,57,0.15)] ring-2 ring-[#8C6239]'
                                  : 'bg-muted'
                              )}
                              onClick={() => {
                                field.onChange(emoji);
                                next();
                              }}
                            >
                              <span className="text-3xl">{emoji}</span>
                              <span className="text-xs mt-1 font-medium text-muted-foreground">
                                {label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <FormField
                  control={form.control}
                  name="wouldRecommend"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl font-semibold text-center block mb-4">
                        Apakah kamu akan me-rekomendasikan{' '}
                        <span
                          className="px-1 rounded-sm font-bold"
                          style={{
                            backgroundColor: 'rgba(140, 98, 57, 0.15)',
                            color: '#8C6239',
                          }}
                        >
                          Zewu
                        </span>{' '}
                        ke temanmu?
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-col gap-4">
                          <Button
                            type="button"
                            onClick={() => {
                              field.onChange('yes');
                              next();
                            }}
                            className={cn(
                              'w-full text-lg py-6 flex items-center justify-center gap-3 transition-all hover:scale-105',
                              field.value === 'yes'
                                ? 'ring-2 ring-[#8C6239] scale-[1.03]'
                                : ''
                            )}
                            style={{
                              backgroundColor:
                                field.value === 'yes' ? '#8C6239' : 'white',
                              color:
                                field.value === 'yes' ? 'white' : '#8C6239',
                              border: '1px solid #8C6239',
                            }}
                          >
                            <ThumbsUp
                              size={20}
                              stroke={
                                field.value === 'yes' ? 'white' : '#8C6239'
                              }
                              className="-mt-0.5"
                            />
                            Iya, tentu!
                          </Button>

                          <Button
                            type="button"
                            onClick={() => {
                              field.onChange('no');
                              next();
                            }}
                            className={cn(
                              'w-full text-lg py-6 flex items-center justify-center gap-3 transition-all hover:scale-105',
                              field.value === 'no'
                                ? 'ring-2 ring-red-400 scale-[1.03]'
                                : ''
                            )}
                            style={{
                              backgroundColor: 'white',
                              color:
                                field.value === 'no' ? '#dc2626' : '#8C6239',
                              border:
                                field.value === 'no'
                                  ? '1px solid #dc2626'
                                  : '1px solid rgba(140,98,57,0.4)',
                            }}
                          >
                            <ThumbsDown
                              size={20}
                              stroke={
                                field.value === 'no' ? '#dc2626' : '#8C6239'
                              }
                              className="-mt-0.5"
                            />
                            Mungkin belum
                          </Button>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-center pt-4">
                  <button
                    type="button"
                    onClick={prev}
                    className="text-sm underline text-muted-foreground hover:text-primary transition-colors"
                  >
                    Kembali
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="suggestion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xl font-semibold text-center mb-4 flex flex-col ">
                          Apa yang bisa kami tingkatkan?{' '}
                          <span className="text-muted-foreground text-sm font-normal mt-2">
                            (opsional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tulis saran, ide, atau masukanmu di sini..."
                            {...field}
                            className="resize-none min-h-[120px] text-[16px]"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium text-muted-foreground text-[14px]">
                          Nama {''}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            // placeholder="Contoh: Andi"
                            {...field}
                            className="w-full border border-black rounded-md px-4 py-3 text-[16px]"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full text-lg py-6 mt-6"
                  style={{ backgroundColor: '#8C6239', color: 'white' }}
                >
                  Kirim
                  <SendIcon size={16} className="ml-2" />
                </Button>

                {/* <p className="text-xs text-center text-muted-foreground mt-2">
                  Feedback ini bersifat anonim dan hanya digunakan untuk
                  meningkatkan layanan{' '}
                  <span
                    className="px-1 rounded-sm font-semibold"
                    style={{
                      backgroundColor: 'rgba(140,98,57,0.15)',
                      color: '#8C6239',
                    }}
                  >
                    Zewu
                  </span>
                  .
                </p> */}

                <div className="flex justify-center pt-4">
                  <button
                    type="button"
                    onClick={prev}
                    className="text-sm underline text-muted-foreground hover:text-primary transition-colors"
                  >
                    Kembali
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </Form>
  );
}
