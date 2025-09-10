import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReportProps {
  summary: string[];
  keywords: string[];
  flashcards: { question: string; answer: string }[];
}

export function Report({ summary, keywords, flashcards }: ReportProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold mb-2">Bulleted Key Objectives</h3>
          <ul className="list-disc pl-5 space-y-1">
            {summary.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="text-lg font-semibold mb-2">Keywords & Crucial Concepts</h3>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                {keyword}
              </span>
            ))}
          </div>
        </section>
        <section>
          <h3 className="text-lg font-semibold mb-2">Flashcards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flashcards.map((flashcard, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <p className="font-semibold mb-2">{flashcard.question}</p>
                  <p>{flashcard.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
