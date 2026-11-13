import styles from "./page.module.scss";
import { suggestionApi } from "@/features/suggestion/suggestion.api";
import { ResultPageForm } from "@/app/results/_components/ResultPageForm/ResultPageForm";
import { ParsedList } from "@/app/results/_components/ParsedList/ParsedList";
import { ResultsSearchParams } from "@/features/suggestion/suggestion.query";
import { redirect } from "next/navigation";
import { MissingInfo } from "@/app/results/_components/MissingInfo/MissingInfo";
import { ApiError } from "@/lib/api-error";
import { PageMessage } from "@/components/ui/PageMessage/PageMessage";
import { ResultsSection } from "@/app/results/_components/ResultsSection/ResultsSection";
import { EmptyResults } from "@/app/results/_components/EmptyResults/EmptyResults";
import { RequestProvider } from "@/app/results/_components/RequestProvider/RequestProvider";
import { MAX_REQUEST_LENGTH, MIN_REQUEST_LENGTH } from "@/lib/request-limits";
import { headers } from "next/headers";

type Props = {
  searchParams: Promise<ResultsSearchParams>;
};

export default async function ResultsPage({ searchParams }: Props) {
  const query = await searchParams;

  if (
    typeof query.input !== "string" ||
    !query.input ||
    query.input.trim().length < MIN_REQUEST_LENGTH ||
    query.input.length > MAX_REQUEST_LENGTH
  ) {
    redirect("/");
  }

  let data;
  try {
    const requestHeaders = await headers();
    const clientIp = requestHeaders
      .get("x-forwarded-for")
      ?.split(",")[0]
      .trim();

    data = await suggestionApi.findSuggestions(
      { input: query.input },
      clientIp,
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 429) {
      return (
        <PageMessage
          variant="wait"
          title="Slow down a little"
          description="You've sent a lot of requests in a short time. Please wait a minute and try again."
          primaryAction={{ label: "Back to home", href: "/" }}
        />
      );
    }
    throw error;
  }

  const { parsed, destinations, missingInfo } = data;

  return (
    <>
      <main>
        <section className={styles.top}>
          <RequestProvider key={query.input} initialText={query.input}>
            <ResultPageForm />

            <div className={styles.understood}>
              <h2 className={styles.understoodTitle}>
                Here&apos;s what we understood
              </h2>
              <ParsedList parsed={parsed} />
            </div>

            {missingInfo.length > 0 && (
              <MissingInfo missingInfo={missingInfo} />
            )}
          </RequestProvider>
        </section>

        {destinations.length > 0 ? (
          <ResultsSection key={query.input} destinations={destinations} />
        ) : (
          <EmptyResults />
        )}
      </main>
    </>
  );
}
