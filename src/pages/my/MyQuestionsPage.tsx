import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/features/user/user.service'
import type { UserQuestion } from '@/features/user/user.service'
import { apiPost } from '@/shared/services/api'
import { queryKeys } from '@/shared/lib/queryKeys'
import { useAuthStore } from '@/stores/auth'
import { useFormatting } from '@/shared/hooks/useFormatting'
import { BaseSkeleton } from '@/shared/components/ui/BaseSkeleton'
import { BaseButton } from '@/shared/components/ui/BaseButton'

const schema = z.object({
  question: z.string().min(10, 'Vul een vraag in van minimaal 10 tekens'),
})

type FormValues = z.infer<typeof schema>

const statusLabel: Record<string, string> = {
  pending: 'In behandeling',
  answered: 'Beantwoord',
}

const statusClass: Record<string, string> = {
  pending: 'text-accent-500 bg-accent-500/10',
  answered: 'text-success bg-success/10',
}

export function MyQuestionsPage() {
  const auth = useAuthStore()
  const queryClient = useQueryClient()
  const { formatDate } = useFormatting()
  const [submitted, setSubmitted] = useState(false)
  const [lastQuestion, setLastQuestion] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const { data: questions, isPending } = useQuery({
    queryKey: queryKeys.myQuestions(),
    queryFn: userService.getQuestions,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = handleSubmit(async (values) => {
    setLastQuestion(values.question)
    await apiPost('/swg/v1/mijn/vragen', {
      question: values.question,
      status: 'pending',
      user_id: auth.user?.id,
      created_at: new Date().toISOString(),
    })
    reset()
    setSubmitted(true)
    queryClient.invalidateQueries({ queryKey: queryKeys.myQuestions() })
  })

  async function deleteQuestion(id: number) {
    setDeletingId(id)
    try {
      await userService.deleteQuestion(id)
      queryClient.setQueryData<UserQuestion[]>(queryKeys.myQuestions(), (old) =>
        old?.filter((q) => q.id !== id) ?? [],
      )
    } catch (e) {
      console.error('Fout bij verwijderen vraag', e)
    } finally {
      setDeletingId(null)
    }
  }

  const textareaClass = `w-full px-3 py-2 border rounded-lg bg-white dark:bg-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none ${
    errors.question ? 'border-red-500' : 'border-gray-300 dark:border-white/20'
  }`

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Mijn vragen</h2>

      <section className="bg-white dark:bg-dark-secondary rounded-2xl shadow-sm p-6">
        <h3 className="text-base font-semibold mb-4">Nieuwe vraag stellen</h3>

        {submitted ? (
          <div role="status" aria-live="polite" className="space-y-4">
            <div className="rounded-xl bg-success/10 border border-success/20 p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-success mb-1">Vraag verstuurd!</p>
                <p className="text-sm text-muted">{lastQuestion}</p>
              </div>
            </div>
            <BaseButton
              variant="secondary"
              size="sm"
              onClick={() => { setSubmitted(false); setLastQuestion('') }}
            >
              Nog een vraag stellen
            </BaseButton>
          </div>
        ) : (
          <form noValidate onSubmit={onSubmit}>
            <div className="mb-4">
              <label htmlFor="question" className="block text-sm font-medium mb-1 dark:text-white">
                Jouw vraag
              </label>
              <textarea
                id="question"
                rows={3}
                className={textareaClass}
                {...register('question')}
              />
              {errors.question && (
                <p role="alert" className="text-sm text-red-500 mt-1">{errors.question.message}</p>
              )}
            </div>
            <BaseButton type="submit" disabled={isSubmitting} size="sm">
              {isSubmitting ? 'Versturen…' : 'Vraag versturen →'}
            </BaseButton>
          </form>
        )}
      </section>

      <section>
        <h3 className="text-base font-semibold mb-4">Eerder gestelde vragen</h3>

        {isPending ? (
          <div className="space-y-3">
            <BaseSkeleton className="h-24 w-full rounded-xl" />
          </div>
        ) : !questions?.length ? (
          <p className="text-sm text-muted">Je hebt nog geen vragen gesteld.</p>
        ) : (
          <ul role="list" className="space-y-4">
            {questions.map((item) => (
              <li key={item.id} className="bg-white dark:bg-dark-secondary rounded-2xl shadow-sm p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <p className="text-sm font-medium dark:text-white">{item.question}</p>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${
                      statusClass[item.status] ?? 'text-muted bg-muted/10'
                    }`}
                  >
                    {statusLabel[item.status] ?? item.status}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs text-muted">
                    Gesteld op {item.created_at ? formatDate(item.created_at) : '—'}
                  </p>
                  {item.status === 'pending' && (
                    <button
                      type="button"
                      disabled={deletingId === item.id}
                      className="text-xs text-red-500 hover:underline disabled:opacity-50"
                      onClick={() => deleteQuestion(item.id)}
                    >
                      {deletingId === item.id ? 'Verwijderen…' : 'Verwijderen'}
                    </button>
                  )}
                </div>
                {item.answer && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/10">
                    <p className="text-xs font-semibold text-success mb-1">Antwoord van SWG:</p>
                    <p className="text-sm text-muted">{item.answer}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
