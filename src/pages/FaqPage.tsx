import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle2 } from 'lucide-react'
import { PageSeo } from '@/shared/components/seo/PageSeo'
import { queryKeys } from '@/shared/lib/queryKeys'
import { usePage } from '@/shared/hooks/usePage'
import { apiPost } from '@/shared/services/api'
import { useAuthStore } from '@/stores/auth'
import { ROUTES } from '@/routes'
import { useUiStore } from '@/stores/ui'
import { PageHero } from '@/shared/components/layout/PageHero'
import { AppSection } from '@/shared/components/layout/AppSection'
import { SidebarLayout } from '@/shared/components/layout/SidebarLayout'
import { FaqAccordion } from '@/shared/components/ui/FaqAccordion'
import { BaseSkeleton } from '@/shared/components/ui/BaseSkeleton'
import { EmptyState } from '@/shared/components/ui/EmptyState'
import { BaseButton } from '@/shared/components/ui/BaseButton'
import { PhotoGrid } from '@/shared/components/ui/PhotoGrid'
import { CtaBlock } from '@/shared/components/blocks/CtaBlock'

import p1 from '@/assets/swg-05.jpg'
import p2 from '@/assets/swg-11.jpg'
import p3 from '@/assets/swg-17.jpg'
import p4 from '@/assets/swg-25.jpg'
import p5 from '@/assets/swg-30.jpg'

const galleryPhotos = [
  { src: p1, alt: '' },
  { src: p2, alt: '' },
  { src: p3, alt: '' },
  { src: p4, alt: '' },
  { src: p5, alt: '' },
]

export function FaqPage() {
  const auth = useAuthStore()
  const ui = useUiStore()
  const queryClient = useQueryClient()
  const [questionText, setQuestionText] = useState('')
  const [lastQuestion, setLastQuestion] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: faqPage } = usePage('faq')

  const acf = faqPage?.acf as Record<string, any> | undefined
  const faqItems: { question: string; answer: string }[] = acf?.faq_items ?? []

  async function submitQuestion() {
    if (!questionText.trim()) return
    setIsSubmitting(true)
    try {
      await apiPost('/swg/v1/mijn/vragen', {
        question: questionText,
        status: 'pending',
        user_id: auth.user?.id,
        created_at: new Date().toISOString(),
      })
      setLastQuestion(questionText)
      setQuestionText('')
      setSubmitted(true)
      queryClient.invalidateQueries({ queryKey: queryKeys.myQuestions() })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <PageSeo
        title={faqPage?.title?.rendered ?? 'Veelgestelde vragen'}
        description={acf?.hero_description}
      />
      <PageHero
        eyebrow={acf?.hero_eyebrow ?? 'FAQ'}
        title={faqPage?.title?.rendered ?? 'Veelgestelde vragen'}
        description={acf?.hero_description}
      />

      <AppSection tag="div">
        <SidebarLayout
          sidebar={
            <div className="hidden lg:block">
              <PhotoGrid photos={galleryPhotos} variant="sidebar" />
            </div>
          }
        >
          <div>
            {!faqPage ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }, (_, i) => <BaseSkeleton key={i} className="h-14" />)}
              </div>
            ) : faqItems.length ? (
              <FaqAccordion items={faqItems} />
            ) : (
              <EmptyState title="Geen vragen gevonden" description="Er zijn momenteel geen veelgestelde vragen. Neem contact met ons op." />
            )}

            {/* Question panel */}
            <section className="mt-12 rounded-2xl border border-gray-200 p-6 dark:border-white/10" aria-labelledby="faq-question-heading">
              <h2 id="faq-question-heading" className="mb-4 text-xl font-semibold dark:text-white">
                Staat jouw vraag er niet bij?
              </h2>

              {auth.isLoggedIn && submitted ? (
                <div role="status" aria-live="polite" className="space-y-4">
                  <div className="bg-success/10 border-success/20 flex items-start gap-3 rounded-xl border p-4">
                    <CheckCircle2 className="text-success mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-success mb-1 text-sm font-semibold">Vraag verstuurd!</p>
                      <p className="text-muted text-sm">{lastQuestion}</p>
                    </div>
                  </div>
                  <BaseButton variant="secondary" size="sm" onClick={() => { setSubmitted(false); setLastQuestion('') }}>
                    Nog een vraag stellen
                  </BaseButton>
                </div>
              ) : auth.isLoggedIn ? (
                <form noValidate onSubmit={(e) => { e.preventDefault(); submitQuestion() }}>
                  <label htmlFor="question-input" className="mb-1 block text-sm font-medium dark:text-white">Jouw vraag</label>
                  <textarea
                    id="question-input"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    rows={4}
                    disabled={isSubmitting}
                    placeholder="Stel hier je vraag..."
                    className="dark:bg-dark focus:ring-primary-500 w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none dark:border-white/20"
                  />
                  <BaseButton
                    type="button"
                    disabled={isSubmitting || !questionText.trim()}
                    className="mt-3"
                    onClick={submitQuestion}
                  >
                    {isSubmitting ? 'Versturen…' : 'Vraag insturen'}
                  </BaseButton>
                </form>
              ) : (
                <div>
                  <p className="text-muted mb-4">Wil je een vraag stellen? Maak een account aan of log in.</p>
                  <div className="flex flex-wrap gap-3">
                    <BaseButton onClick={() => ui.openAuthModal({ view: 'login', redirectTo: ROUTES.faq })}>
                      Inloggen →
                    </BaseButton>
                    <BaseButton variant="secondary" onClick={() => ui.openAuthModal({ view: 'register' })}>
                      Account aanvragen
                    </BaseButton>
                  </div>
                </div>
              )}
            </section>
          </div>
        </SidebarLayout>
      </AppSection>

      <CtaBlock heading="Doe mee met SWG Nederland" />
    </>
  )
}
