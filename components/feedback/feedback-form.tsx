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
import Image from 'next/image';

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
    console.log('📬 Feedback dikirim:', values);
    setSubmitted(values);
    setStep('done');
  };

  if (step === 'done') {
    const rating = submitted?.rating ?? '😊';
    const THANKS_COPY: Record<FeedbackValues['rating'], string> = {
      '😍': 'Senang banget kamu puas dengan Zewu! Sampai jumpa lagi ☕',
      '😊': 'Terima kasih atas kunjunganmu! Sampai ketemu lagi di Zewu ☕',
      '😐': 'Terima kasih! Kami akan terus meningkatkan pengalamanmu 🙏',
      '😡': 'Maaf atas ketidaknyamanannya. Masukanmu sangat berarti bagi kami 🙏',
    };

    return (
      <div className="text-center space-y-3 py-10 max-w-md mx-auto">
        <h2 className="text-2xl font-semibold">🎉 Terima kasih!</h2>
        <p className="text-base text-muted-foreground">{THANKS_COPY[rating]}</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-md mx-auto p-4"
      >
        <div className="flex justify-center mb-2">
          <Image
            src="/zewu.png"
            alt="Zewu Logo"
            width={140}
            height={140}
            className="rounded-full"
            priority
          />
        </div>

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
                      <FormLabel className="text-xl font-semibold text-center block mb-3">
                        Seberapa puas dengan kunjunganmu ke{' '}
                        <span className="bg-[#fffacc] px-1 rounded-sm">
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
                                'p-2 flex flex-col items-center transition-all rounded-xl min-w-[64px] hover:scale-110 focus:outline-none',
                                field.value === emoji &&
                                  'ring-2 ring-primary scale-110 bg-muted'
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
                        Setelah kunjunganmu hari ini, apakah kamu akan
                        merekomendasikan{' '}
                        <span className="bg-[#fffacc] px-1 rounded-sm">
                          Zewu
                        </span>{' '}
                        ke temanmu?
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-col gap-4">
                          <Button
                            type="button"
                            variant="elevated"
                            className={cn(
                              'w-full text-lg py-6',
                              field.value === 'yes' &&
                                'ring-2 ring-primary scale-[1.03]'
                            )}
                            onClick={() => {
                              field.onChange('yes');
                              next();
                            }}
                          >
                            ✅ Iya, tentu!
                          </Button>
                          <Button
                            type="button"
                            variant="elevated"
                            className={cn(
                              'w-full text-lg py-6',
                              field.value === 'no' &&
                                'ring-2 ring-destructive scale-[1.03]'
                            )}
                            onClick={() => {
                              field.onChange('no');
                              next();
                            }}
                          >
                            ❌ Mungkin belum
                          </Button>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-center pt-2">
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
                <FormField
                  control={form.control}
                  name="suggestion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl font-semibold text-center block mb-2">
                        Apa yang bisa kami tingkatkan?{' '}
                        <span className="text-muted-foreground text-sm font-normal">
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
                <Button type="submit" className="w-full text-lg py-6">
                  Kirim Feedback ✉️
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Feedback ini bersifat anonim dan hanya digunakan untuk
                  meningkatkan layanan{' '}
                  <span className="bg-[#fffacc] px-1 rounded-sm">Zewu</span>.
                </p>
                <div className="flex justify-center pt-2">
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
