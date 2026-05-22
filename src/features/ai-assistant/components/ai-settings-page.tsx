import {
  Bot,
  CircleDollarSign,
  Clock3,
  Languages,
  Plus,
  Save,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { NotificationBell } from '@/components/notification-bell'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useAiSettings } from '../hooks'
import { mockAiAssistantSettings, supportedLanguageOptions } from '../mock-data'

export function AiSettingsPage() {
  const {
    selectedLanguages,
    toggleLanguage,
    faqs,
    updateFaq,
    addFaq,
    removeFaq,
  } = useAiSettings()

  return (
    <>
      <Header>
        <Search className='me-auto' />
        <NotificationBell />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='space-y-5'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>AI Settings</h1>
            <p className='text-sm text-muted-foreground'>
              Configure how Clinic AI Assistant answers patients and routes
              clinic requests.
            </p>
          </div>
          <Button className='gap-2'>
            <Save className='size-4' />
            Save Settings
          </Button>
        </div>

        <section className='grid gap-4 xl:grid-cols-[1fr_360px]'>
          <div className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Clock3 className='size-5 text-primary' />
                  Clinic Timings
                </CardTitle>
                <CardDescription>
                  Set the operating window the AI can share with patients.
                </CardDescription>
              </CardHeader>
              <CardContent className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='weekday-open'>Weekday opening time</Label>
                  <Input
                    id='weekday-open'
                    type='time'
                    defaultValue={mockAiAssistantSettings.timings.weekdayOpen}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='weekday-close'>Weekday closing time</Label>
                  <Input
                    id='weekday-close'
                    type='time'
                    defaultValue={mockAiAssistantSettings.timings.weekdayClose}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='weekend-open'>Saturday opening time</Label>
                  <Input
                    id='weekend-open'
                    type='time'
                    defaultValue={mockAiAssistantSettings.timings.saturdayOpen}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='weekend-close'>Saturday closing time</Label>
                  <Input
                    id='weekend-close'
                    type='time'
                    defaultValue={mockAiAssistantSettings.timings.saturdayClose}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Bot className='size-5 text-primary' />
                  AI Greeting Message
                </CardTitle>
                <CardDescription>
                  This message appears when patients start a new conversation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  className='min-h-32 resize-none'
                  defaultValue={mockAiAssistantSettings.greetingMessage}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                  <div>
                    <CardTitle>FAQ Management</CardTitle>
                    <CardDescription>
                      Add common clinic answers the AI can use before routing to
                      staff.
                    </CardDescription>
                  </div>
                  <Button variant='outline' className='gap-2' onClick={addFaq}>
                    <Plus className='size-4' />
                    Add FAQ
                  </Button>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                {faqs.map((faq, index) => (
                  <div
                    key={`${faq.question}-${index}`}
                    className='rounded-lg border p-4'
                  >
                    <div className='mb-3 flex items-center justify-between gap-3'>
                      <p className='text-sm font-medium'>FAQ {index + 1}</p>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => removeFaq(index)}
                        disabled={faqs.length === 1}
                      >
                        <Trash2 className='size-4' />
                        <span className='sr-only'>Remove FAQ</span>
                      </Button>
                    </div>
                    <div className='grid gap-3'>
                      <div className='space-y-2'>
                        <Label htmlFor={`faq-question-${index}`}>
                          Question
                        </Label>
                        <Input
                          id={`faq-question-${index}`}
                          value={faq.question}
                          onChange={(event) =>
                            updateFaq(index, 'question', event.target.value)
                          }
                          placeholder='Enter patient question'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor={`faq-answer-${index}`}>Answer</Label>
                        <Textarea
                          id={`faq-answer-${index}`}
                          value={faq.answer}
                          onChange={(event) =>
                            updateFaq(index, 'answer', event.target.value)
                          }
                          placeholder='Enter AI-approved answer'
                          className='min-h-20 resize-none'
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <aside className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <CircleDollarSign className='size-5 text-primary' />
                  Consultation Fee
                </CardTitle>
                <CardDescription>
                  The default fee shown in patient conversations.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-2'>
                <Label htmlFor='consultation-fee'>
                  Default consultation fee
                </Label>
                <div className='relative'>
                  <span className='absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground'>
                    $
                  </span>
                  <Input
                    id='consultation-fee'
                    type='number'
                    min='0'
                    defaultValue={mockAiAssistantSettings.consultationFee}
                    className='ps-7'
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Languages className='size-5 text-primary' />
                  Supported Languages
                </CardTitle>
                <CardDescription>
                  Choose languages the AI may use with patients.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-3'>
                {supportedLanguageOptions.map((language) => (
                  <label
                    key={language}
                    className='flex items-center gap-3 rounded-md border px-3 py-2 text-sm'
                  >
                    <Checkbox
                      checked={selectedLanguages.includes(language)}
                      onCheckedChange={() => toggleLanguage(language)}
                    />
                    {language}
                  </label>
                ))}
              </CardContent>
            </Card>

            <Card className='border-primary/20 bg-primary/5'>
              <CardHeader>
                <CardTitle className='text-base'>Review Workflow</CardTitle>
                <CardDescription>
                  AI replies are drafted for staff review before sending to
                  patients.
                </CardDescription>
              </CardHeader>
            </Card>
          </aside>
        </section>
      </Main>
    </>
  )
}
