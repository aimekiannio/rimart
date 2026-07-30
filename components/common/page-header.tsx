import { Container } from "@/components/layout/container";
import { headingVariants, textVariants } from "@/styles/typography";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  className?: string;
};

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <Container className={cn("py-10 sm:py-14", className)}>
      <div className="max-w-3xl space-y-3">
        <h1 className={headingVariants({ level: "h2" })}>{title}</h1>
        {description ? (
          <p className={textVariants({ variant: "lead" })}>{description}</p>
        ) : null}
      </div>
    </Container>
  );
}
