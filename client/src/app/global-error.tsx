'use client';

import { PageMessage } from '@/components/ui/PageMessage/PageMessage';

type Props = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function GlobalError({ retry }: Props) {
  return (
    <html lang="en">
      <body>
        <title>Something went wrong</title>
        <PageMessage
          title="Something went wrong"
          description="The site hit an unexpected error. This is usually temporary, so please try again."
          primaryAction={{ label: 'Try again', onClick: () => retry() }}
          secondaryAction={{
            label: 'Back to home',
            onClick: () => {
              
              window.location.assign('/');
            },
          }}
        />
      </body>
    </html>
  );
}
