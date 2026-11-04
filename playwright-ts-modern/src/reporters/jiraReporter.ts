import fs from 'node:fs/promises';
import path from 'node:path';
import type {FullConfig, FullResult, Reporter, TestCase, TestResult} from '@playwright/test/reporter';

type JiraPayload = {testId: string; title: string; status: string; failureReason: string | null; jiraLabels: string[]};
type ReporterOptions = {outputFile?: string};

class JiraReporter implements Reporter {
  private readonly payloads: JiraPayload[] = [];
  private readonly outputFile: string;

  constructor(options: ReporterOptions = {}) { this.outputFile = options.outputFile ?? 'test-results/jira-results.json'; }
  onBegin(_config: FullConfig): void { this.payloads.length = 0; }

  onTestEnd(test: TestCase, result: TestResult): void {
    const id = test.annotations.find(annotation => annotation.type === 'jira');
    const labels = test.annotations.filter(annotation => annotation.type === 'label').map(annotation => annotation.description ?? '');
    this.payloads.push({
      testId: id?.description ?? test.titlePath().join(' / ').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').toUpperCase(),
      title: test.title,
      status: result.status,
      failureReason: result.error?.message?.split('\n')[0] ?? null,
      jiraLabels: ['playwright', ...labels]
    });
  }

  async onEnd(_result: FullResult): Promise<void> {
    const destination = path.resolve(process.cwd(), this.outputFile);
    await fs.mkdir(path.dirname(destination), {recursive: true});
    await fs.writeFile(destination, `${JSON.stringify(this.payloads, null, 2)}\n`, 'utf8');
  }
}

export default JiraReporter;
