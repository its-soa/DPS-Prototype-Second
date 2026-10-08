import { LinkButton } from '../components/Button'
import { PageTitle } from '../components/PageTitle'

export default function NotFound({ message }: { message?: string }) {
  return (
    <div className="grid max-w-prose gap-4">
      <PageTitle>We couldn’t find that page</PageTitle>
      <p className="text-lg">{message ?? 'That address doesn’t match anything in Pathwise. Your progress is safe.'}</p>
      <div>
        <LinkButton to="/">Back to today’s course</LinkButton>
      </div>
    </div>
  )
}
