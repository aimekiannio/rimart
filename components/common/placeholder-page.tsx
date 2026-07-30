import { MainLayout } from "@/components/layout/main-layout";
import { PageHeader } from "@/components/common/page-header";
import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";
import { textVariants } from "@/styles/typography";

type PlaceholderPageProps = {
  title: string;
  description: string;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <MainLayout>
      <PageHeader title={title} description={description} />
      <Container className="pb-16">
        <Card>
          <CardContent className="py-10">
            <p className={textVariants({ variant: "muted" })}>
              This section is under development. Content will be added in a
              future release.
            </p>
          </CardContent>
        </Card>
      </Container>
    </MainLayout>
  );
}
