import Link from "next/link"
import { withMonth } from "@/utils/month"

interface Props {
  month: string
  /** the current trend page, e.g. "Overview" */
  current: string
}

/** "Trends › Overview" above a trend page; the current page isn't a link. */
export const TrendsBreadcrumb = ({ month, current }: Props) => (
  <nav aria-label="Breadcrumb" className="text-sm text-neutral-500">
    <Link
      href={withMonth("/my-balance/trends", month)}
      className="underline-offset-2 hover:text-brand-900 hover:underline"
    >
      Trends
    </Link>
    <span aria-hidden className="mx-1.5">
      ›
    </span>
    <span aria-current="page" className="font-semibold text-brand-900">
      {current}
    </span>
  </nav>
)
